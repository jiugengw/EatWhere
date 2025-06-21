import Group from './groupModel.js';
import User from './../users/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

export const generateCode = (length = 8) => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  let index;

  for (let i = 0; i < length; i++) {
    index = Math.floor(Math.random() * characters.length);
    code += characters[index];
  }

  return code;
};

export const isUserInGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('Group not found or inactive.', StatusCodes.NOT_FOUND);
  }

  return group.users.some((id) => id.equals(userId));
};

export const joinGroupById = async (groupId, userId) => {
  const alreadyInGroup = await isUserInGroup(groupId, userId);

  if (!alreadyInGroup) {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    group.users.push(userId);
    user.groups.push(groupId);

    await group.save();
    await user.save();
  }

  return {
    message: alreadyInGroup
      ? 'User is already a member of this group'
      : 'User successfully joined the group',
    groupId,
    userId,
  };
};

export const leaveGroupById = async (groupId, userId) => {
  const alreadyInGroup = await isUserInGroup(groupId, userId);

  if (alreadyInGroup) {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    group.users.pull(userId);
    user.groups.pull(groupId);

    await group.save();
    await user.save();
  }

  return {
    message: alreadyInGroup
      ? 'You have left the group'
      : 'You are not a member of this group',
    groupId,
    userId,
  };
};
