import { StatusCodes } from 'http-status-codes';
import { Group } from './groupModel.js';
import { Types } from 'mongoose';
import { AppError } from '../common/utils/AppError.js';
import { User } from '../users/userModel.js';
import { generateUniqueGroupCode } from './utils/generateUniqueGroupCode.js';
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
    return group.users.some((entry) => entry.user.equals(userId));
};
export const joinGroupByCode = async (code, userId) => {
    const group = await Group.findOne({ code });
    if (!group) {
        throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    }
    const alreadyInGroup = await isUserInGroup(group._id.toString(), userId);
    if (!alreadyInGroup) {
        const user = await User.findById(userId);
        if (!user)
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        group.users.push({ user: new Types.ObjectId(userId), role: 'member' });
        user.groups.push(group._id);
        await group.save();
        await user.save();
    }
    return {
        message: alreadyInGroup
            ? 'User is already a member of this group'
            : 'User successfully joined the group',
        group,
    };
};
export const createGroupForUser = async (userId, groupInput) => {
    const data = {
        ...groupInput,
        code: await generateUniqueGroupCode(),
        users: [
            {
                user: userId,
                role: 'admin',
            },
        ],
    };
    const newGroup = await Group.create(data);
    await User.findByIdAndUpdate(userId, {
        $push: { groups: newGroup._id },
    });
    return newGroup;
};
