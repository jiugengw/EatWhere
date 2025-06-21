import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/AppError.js';
import User from './../users/userModel.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import config from './../utils/config.js';
import * as authService from './authService.js';

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
      User: user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await authService.signupUser(req.body);
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

  const user = await authService.loginUser(usernameOrEmail, password);
  createSendToken(user, StatusCodes.OK, res);
});

export const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token)
    return next(
      new AppError('You are not logged in!', StatusCodes.UNAUTHORIZED)
    );

  const user = await authService.verifyAndGetUser(token);
  req.user = user;
  next();
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await authService.updateUserPassword(
    req.user.id,
    req.body.passwordCurrent,
    req.body.passwordNew,
    req.body.passwordConfirm
  );
  createSendToken(user, StatusCodes.OK, res);
});
