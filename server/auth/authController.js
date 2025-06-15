import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/AppError.js';
import User from './../users/userModel.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import sendEmail from './../utils/email.js';
import crypto from 'crypto';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN)),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

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
  
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(
        'There is no user with this email address',
        StatusCodes.NOT_FOUND
      )
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Hi ${user.name},

    You requested a password reset. Click the link below to set a new password:
    ${resetURL}

    This link will expire in 10 minutes.

    If you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token for Where2Eat',
      message,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Password reset token sent to email.',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email!',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Token is invalid or has expired.', StatusCodes.UNAUTHORIZED)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, StatusCodes.OK, res);
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
