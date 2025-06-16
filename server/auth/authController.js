import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/AppError.js';
import User from './../users/userModel.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import config from './../utils/config.js';

const signToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + Number(config.JWT_COOKIE_EXPIRES_IN)),
    httpOnly: true,
  };
  if (config.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, StatusCodes.CREATED, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return next(
      new AppError(
        'Please provide username/email and password!',
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  const queryField = validator.isEmail(usernameOrEmail) ? 'email' : 'username';
  const user = await User.findOne({ [queryField]: usernameOrEmail }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username/email or password!'));
  }

  createSendToken(user, StatusCodes.OK, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
 
  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password!'),
      StatusCodes.UNAUTHORIZED
    );
  }

  req.user = currentUser;
  next();
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError('Your current password is wrong!', StatusCodes.UNAUTHORIZED)
    );
  }

  user.password = req.body.passwordNew;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});
