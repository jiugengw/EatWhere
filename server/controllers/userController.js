import User from './../models/userModel.js';

import modifyPreferences from './../services/userService.js';
import getHistory from './../services/historyService.js';
import { getGroupsByUser } from './../services/groupService.js';

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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getCurrentUser = catchAsync(async (req, res, next) => {
  const user = req.user;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

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
  const userHistory = getHistory('user', req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: {
      history: userHistory,
    },
  });
});

export const getUserGroups = catchAsync(async (req, res, next) => {
  const userGroups = getGroupsByUser(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    data: {
      groups: userGroups,
    },
  });
});

export const getUserByUsername = catchAsync(async (req, res, next) => {
    const user = req.user
})
