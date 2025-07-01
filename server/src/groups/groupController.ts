import { StatusCodes } from 'http-status-codes';
import { Group } from './groupModel.js';
import {
  isUserInGroup,
  joinGroupById,
  leaveGroupById,
  updateGroupById,
} from './groupService.js';
import { RequestHandler } from 'express';
import { AppError } from '../common/utils/AppError.js';
import { catchAsync } from '../common/utils/catchAsync.js';
import { createOne, getOne, deleteOne } from '../common/utils/handlerFactory.js';
import { UpdateGroupSchema } from '../shared/schemas/UpdateGroupSchema.js';
import { User } from '../users/userModel.js';

export const createGroup: RequestHandler = createOne(Group);

export const getGroup: RequestHandler = getOne(Group, {
  populateOptions: {
    path: 'users',
    select: 'username firstName lastName',
  },
});

export const updateGroup = catchAsync(async (req, res, next) => {
  const parsed = UpdateGroupSchema.safeParse(req.body);

  if (!parsed.success) {
    return next(
      new AppError(
        'Validation failed',
        StatusCodes.BAD_REQUEST,
        parsed.error.flatten().fieldErrors
      )
    );
  }

  const updatedGroup = await updateGroupById(req.params.id, parsed.data);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      group: updatedGroup,
    },
  });
});

export const deleteGroup: RequestHandler = deleteOne(Group, {
  postDeleteFn: async (group) => {
    await User.updateMany(
      { groups: group.id },
      { $pull: { groups: group.id } }
    );
  },
});

// export const getGroupHistory: RequestHandler = getOne(Group, {
//   populateOptions: { path: 'history' },
//   selectFields: 'history',
// });

export const getGroupUsers: RequestHandler = getOne(Group, {
  populateOptions: { path: 'users' },
  selectFields: 'users',
});

export const getGroupByCode: RequestHandler = getOne(Group, {
  populateOptions: {
    path: 'users',
    select: '_id',
  },
  findByFn: (req) => ({ code: req.params.code }),
});

export const checkUserInGroup = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const isMember = await isUserInGroup(req.params.id, req.user.id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      isMember,
    },
  });
});

export const joinGroup = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { message, groupId, userId } = await joinGroupById(
    req.params.id,
    req.user.id
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    message,
    data: { groupId, userId },
  });
});

export const leaveGroup = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const { message, groupId, userId } = await leaveGroupById(
    req.params.id,
    req.user.id
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    message,
    data: { groupId, userId },
  });
});
