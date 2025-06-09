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


