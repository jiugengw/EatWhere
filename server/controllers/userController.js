import User from './../models/userModel.js';

import modifyPreferences from './../services/userService.js';
import fetchHistory from './../services/historyService.js';
import fetchGroups from './../services/groupService.js';

import generateDefaultPreferences from './../constants/defaultCuisines.js';
import catchAsync from './../utils/catchAsync.js';

export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  newUser.preferences = generateDefaultPreferences();

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  Object.assign(req.user, req.body);
  const user = await req.user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  await req.user.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getUserPreferences = catchAsync(async (req, res, next) => {
  const preferences = req.user.preferences;

  res.status(200).json({
    status: 'success',
    data: {
      preferences,
    },
  });
});

// for both creating and updating
export const updateUserPreferences = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { preferences } = req.body;

  const updatedPrefs = modifyPreferences(user, preferences);
  res.status(200).json({
    status: 'success',
    data: {
      preferences: updatedPrefs,
    },
  });
});

export const getUserHistory = catchAsync(async (req, res, next) => {
  const userHistory = fetchHistory('user', req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: {
      history: userHistory,
    },
  });
});

export const getUserGroups = catchAsync(async (req, res, next) => {
  const userGroups = fetchGroups(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: {
      groups: userGroups,
    },
  });
});
