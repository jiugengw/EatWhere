import Group from './groupModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from '../utils/handlerFactory.js';
import filterObj from '../utils/filterObj.js';
import { StatusCodes } from 'http-status-codes';
import * as groupService from './groupService.js';

export const createGroup = factory.createOne(Group);

export const getGroup = factory.getOne(Group, {
  populateOptions: {
    path: 'users',
    select: 'username firstName lastName email preferences',
  },
});

export const updateGroup = factory.updateOne(Group, {
  filteredBodyFn: (req) => filterObj(req.body, 'name'),
});

export const deleteGroup = factory.deleteOne(Group, {
  postDeleteFn: async (group) => {
    await User.updateMany(
      { groups: group._id },
      { $pull: { groups: group._id } }
    );
  },
});

export const getGroupHistory = factory.getOne(Group, {
  populateOptions: 'history',
  selectFields: 'history',
});

export const getGroupUsers = factory.getOne(Group, {
  populateOptions: 'users',
  selectFields: 'users',
});

export const getGroupPreferences = factory.getOne(Group, {
  selectFields: 'preferences',
});

export const getGroupByCode = factory.getOne(Group, {
  populateOptions: { path: 'users', select: 'username firstName lastName' },
  findByFn: (req) => ({ code: req.params.code }),
});

export const joinGroup = catchAsync(async (req, res, next) => {
  const result = await groupService.joinGroupById(req.params.id, req.user.id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: result.message,
    data: {
      groupId: result.groupId,
      userId: result.userId,
    },
  });
});

export const leaveGroup = catchAsync(async(req, res, next) => {
  
});
