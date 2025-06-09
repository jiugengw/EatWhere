import User from './../models/userModel.js';
import History from './../models/historyModel.js';
import Group from './../models/groupModel.js';

import { getGroupByCode } from './../services/groupService.js';

import catchAsync from './../utils/catchAsync.js';

export const createGroup = catchAsync(async (req, res, next) => {
  const newGroup = await Group.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      group: newGroup,
    },
  });
});

export const getGroup = catchAsync(async (req, res, next) => {
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
