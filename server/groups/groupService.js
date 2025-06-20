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

export const joinGroupById = async (groupId, userId) => {
  console.log(groupId, userId);
  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('Group not found or inactive.', StatusCodes.NOT_FOUND);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found or inactive', StatusCodes.NOT_FOUND);
  }

  const userAlreadyInGrp = group.users.some((id) => id.equals(userId));
  const grpAlreadyInUser = user.groups.some((id) => id.equals(groupId));

  if (!userAlreadyInGrp) group.users.push(userId);
  if (!grpAlreadyInUser) user.groups.push(groupId);

  await group.save();
  await user.save();

  return {
    message:
      userAlreadyInGrp && grpAlreadyInUser
        ? 'User is already a member of this group'
        : 'User successfully joined the group',
    groupId,
    userId,
  };
};
