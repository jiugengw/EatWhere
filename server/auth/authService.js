import AppError from './../utils/AppError.js';
import User from './../users/userModel.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import config from './../utils/config.js';

export const signToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const verifyAndGetUser = async (token) => {
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists.', StatusCodes.UNAUTHORIZED);
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    throw new AppError(
      'Password changed after token was issued.',
      StatusCodes.UNAUTHORIZED
    );
  }

  return user;
};

export const signupUser = async (body) => {
  const signupFields = [
    'username',
    'email',
    'password',
    'passwordConfirm',
    'firstName',
    'lastName',
  ];
  const data = {};
  for (const [key, value] of Object.entries(body)) {
    if (signupFields.includes(key)) {
      data[key] = value;
    }
  }
  return await User.create(data);
};

export const loginUser = async (usernameOrEmail, password) => {
  const queryField = validator.isEmail(usernameOrEmail) ? 'email' : 'username';
  const user = await User.findOne({ [queryField]: usernameOrEmail }).select(
    '+password'
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect username/email or password!');
  }

  return user;
};

export const updateUserPassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) => {
  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError(
      'Your current password is wrong!',
      StatusCodes.UNAUTHORIZED
    );
  }

  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();
  return user;
};
