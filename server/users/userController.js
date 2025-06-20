import User from './userModel.js';
import History from './../history/historyModel.js';
import * as factory from './../utils/handlerFactory.js';
import * as userService from './userService.js';
import catchAsync from '../utils/catchAsync.js';
import filterObj from '../utils/filterObj.js';
import { StatusCodes } from 'http-status-codes';

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = factory.getOne(User);

export const getUserHistory = factory.getOne(User, {
  populateOptions: 'history',
  selectFields: 'history',
});

export const getUserGroups = factory.getOne(User, {
  populateOptions: 'groups',
  selectFields: 'groups',
});

export const getUserPreferences = factory.getOne(User, {
  selectFields: 'preferences',
});

export const getUserByUsername = factory.getOne(User, {
  selectFields: 'username firstName lastName',
  findByFn: (req) => ({ username: req.params.username }),
  enableVirtuals: true,
});

export const deleteUser = factory.deleteOne(User, {
  postDeleteFn: async (user) => {
    await Group.updateMany(
      { users: user._id },
      { $pull: { users: user._id } }
    );
  },
});

export const updateUser = factory.updateOne(User, {
  filteredBodyFn: (req) =>
    filterObj(req.body, 'username', 'email', 'firstName', 'lastName'),
});

export const updateMyPreferences = catchAsync(async (req, res, next) => {
  const newPreferences = req.body.preferences;

  const updatedUser = await userService.updateUserPreferences(
    req.user.id,
    newPreferences
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      Preferences: updatedUser.preferences,
    },
  });
});
