import { StatusCodes } from 'http-status-codes';
import { Group } from './groupModel';
import { Types } from 'mongoose';
import { AppError } from '@/common/utils/AppError';
import { UpdateGroupInput } from '@/shared/schemas/UpdateGroupSchema';
import { User } from '@/users/userModel';

export const updateGroupById = async (groupId: string, data: UpdateGroupInput) => {
  const updatedGroup = await Group.findByIdAndUpdate(groupId, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedGroup) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND);
  }

  return updatedGroup;
};

type JoinLeaveGroupResponse = {
  message: string;
  groupId: string;
  userId: string;
};

export const isUserInGroup = async (
  groupId: string,
  userId: string
): Promise<boolean> => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('Group not found or inactive.', StatusCodes.NOT_FOUND);
  }

  return group.users.some((id: Types.ObjectId) => id.equals(userId));
};

export const joinGroupById = async (
  groupId: string,
  userId: string
): Promise<JoinLeaveGroupResponse> => {
  const alreadyInGroup = await isUserInGroup(groupId, userId);

  if (!alreadyInGroup) {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    group.users.push(new Types.ObjectId(userId));
    user.groups.push(new Types.ObjectId(groupId));

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

export const leaveGroupById = async (
  groupId: string,
  userId: string
): Promise<JoinLeaveGroupResponse> => {
  const alreadyInGroup = await isUserInGroup(groupId, userId);

  if (alreadyInGroup) {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    (group.users as Types.Array<Types.ObjectId>).pull(userId);
    (user.groups as Types.Array<Types.ObjectId>).pull(groupId);

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
