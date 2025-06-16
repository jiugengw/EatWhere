import User from './userModel.js';
import History from './../history/historyModel.js';
import * as factory from './../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import filterObj from '../utils/filterObj.js';

export const getUser = factory.getOne({ Model: User });

export const getUserHistory = factory.getOne({
  Model: User,
  populateOptions: 'history',
  selectFields: 'history',
  dataKey: 'user',
});

export const getUserGroups = factory.getOne({
  Model: User,
  populateOptions: 'groups',
  selectFields: 'groups',
  dataKey: 'user',
});

export const getUserPreferences = factory.getOne({
  Model: User,
  selectFields: 'preferences',
  dataKey: 'user',
});

export const getUserByUsername = factory.getOne({
  Model: User,
  selectFields: 'username firstName lastName',
  findByFn: (req) => ({ username: req.params.username }),
  disableVirtuals: false,
  dataKey: 'user',
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(StatusCodes.NO_CONTENT).end();
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    'username',
    'email',
    'firstName',
    'lastName'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const updateMyPreferences = catchAsync(async (req, res, next) => {
  const newPreferences = req.body.preferences;
  const updateOptions = {};

  newPreferences.forEach((pref) => {
    const { cuisine, points } = pref;
    updateOptions[`preferences.${cuisine}`] = Number(points);
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateOptions },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      preferences: updatedUser.preferences,
    },
  });
});
