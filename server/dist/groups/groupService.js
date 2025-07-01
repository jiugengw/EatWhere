import { StatusCodes } from 'http-status-codes';
import { Group } from './groupModel.js';
import { Types } from 'mongoose';
import { AppError } from '../common/utils/AppError.js';
import { User } from '../users/userModel.js';
export const updateGroupById = async (groupId, data) => {
    const updatedGroup = await Group.findByIdAndUpdate(groupId, data, {
        new: true,
        runValidators: true,
    });
    if (!updatedGroup) {
        throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    }
    return updatedGroup;
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
        if (!group)
            throw new AppError('Group not found', StatusCodes.NOT_FOUND);
        if (!user)
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
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
export const leaveGroupById = async (groupId, userId) => {
    const alreadyInGroup = await isUserInGroup(groupId, userId);
    if (alreadyInGroup) {
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);
        if (!group)
            throw new AppError('Group not found', StatusCodes.NOT_FOUND);
        if (!user)
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
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
