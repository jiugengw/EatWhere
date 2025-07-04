import { StatusCodes } from 'http-status-codes';
import { Group } from './groupModel.js';
import {
  createGroupForUser,
  isUserInGroup,
  joinGroupByCode,
  leaveGroupsByIds,
  removeMembers,
  updateGroupById,
  updateGroupMemberRoles
} from './groupService.js';
import { RequestHandler } from 'express';
import { AppError } from '../common/utils/AppError.js';
import { catchAsync } from '../common/utils/catchAsync.js';
import { getOne, deleteOne } from '../common/utils/handlerFactory.js';
import { UpdateGroupSchema } from '../shared/schemas/UpdateGroupSchema.js';
import { CreateGroupSchema } from '../shared/schemas/CreateGroupSchema.js';
import { JoinGroupSchema } from '../shared/schemas/JoinGroupSchema.js';
import { RemoveGroupMembersSchema } from '../shared/schemas/RemoveMembersSchema.js';
import { LeaveGroupsSchema } from '../shared/schemas/LeaveGroupsSchema.js';
import { UpdateGroupRolesSchema } from '../shared/schemas/UpdateGroupRolesSchema.js';
import { removeGroupsFromUsers } from './utils/removeGroupsFromUsers.js';

export const getGroup: RequestHandler = getOne(Group, {
  populateOptions: {
    path: 'users.user',
    select: 'username fullName firstName lastName email',
  },
});

export const updateGroup = catchAsync(async (req, res, next) => {
  const parsed = UpdateGroupSchema.safeParse(req.body);
  console.log(parsed);
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
    await removeGroupsFromUsers(group.id);
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
  console.log(req);
  const parsed = JoinGroupSchema.safeParse(req.params);

  if (!parsed.success) {
    console.log('Validation errors:', parsed.error.flatten().fieldErrors);
    return next(
      new AppError(
        'Validation failed',
        StatusCodes.BAD_REQUEST,
        parsed.error.flatten().fieldErrors
      )
    );
  }

  const { code } = parsed.data;

  const { message, group } = await joinGroupByCode(code, req.user.id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message,
    data: { Group: group },
  });
});

export const leaveGroups = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const parsed = LeaveGroupsSchema.safeParse(req.body);

  if (!parsed.success) {
    return next(
      new AppError(parsed.error.errors[0].message, StatusCodes.BAD_REQUEST)
    );
  }

  const { groupIds } = parsed.data;

  const { leftGroupNames, message, failedGroups } = await leaveGroupsByIds(groupIds, req.user.id);

  const status =
    failedGroups.length > 0
      ? leftGroupNames.length > 0
        ? StatusCodes.OK // partial success
        : StatusCodes.BAD_REQUEST // all failed
      : StatusCodes.OK;  // all passed

  res.status(status).json({
    status: failedGroups.length > 0
      ? leftGroupNames.length > 0
        ? 'partial'
        : 'fail'
      : 'success',
    message,
    data: {
      leftGroupNames,
      failedGroups,
      userId: req.user.id,
    },
  });
});

export const createGroup = catchAsync(async (req, res, next) => {
  const parsed = CreateGroupSchema.safeParse(req.body);

  if (!parsed.success) {
    return next(
      new AppError(
        'Group creation validation failed',
        StatusCodes.BAD_REQUEST,
        parsed.error.flatten().fieldErrors
      )
    );
  }

  if (!req.user) {
    return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
  }

  const newGroup = await createGroupForUser(req.user.id, parsed.data);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: { Group: newGroup },
  });
});

export const updateGroupRoles = catchAsync(async (req, res, next) => {
  const { id: groupId } = req.params;

  const parsed = UpdateGroupRolesSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(
      new AppError('Invalid request body', StatusCodes.BAD_REQUEST, parsed.error)
    );
  }

  const { userIds, role } = parsed.data;

  const { alreadyInRole, updatedUsers } = await updateGroupMemberRoles(groupId, userIds, role);

  let message = '';
  if (updatedUsers.length > 0) {
    message += `Updated role "${role}" for: ${updatedUsers.join(', ')}. `;
  }

  if (alreadyInRole.length > 0) {
    message += `Users already have role "${role}": ${alreadyInRole.join(', ')}.`;
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: message.trim(),
    data: {
      role,
      updatedUsers,
      alreadyInRole,
    },
  });
});

export const removeGroupMembers = catchAsync(async (req, res) => {
  const { id: groupId } = req.params;
  const parsed = RemoveGroupMembersSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError('Invalid request data', StatusCodes.BAD_REQUEST);
  }

  const { userIds } = parsed.data;

  await removeMembers(groupId, userIds);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Users removed from group',
  });
});