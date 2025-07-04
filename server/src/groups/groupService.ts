import { StatusCodes } from 'http-status-codes';
import { Group, GroupDoc } from './groupModel.js';
import { Types } from 'mongoose';
import { AppError } from '../common/utils/AppError.js';
import { UpdateGroupInput } from '../shared/schemas/UpdateGroupSchema.js';
import { User, type UserDoc } from '../users/userModel.js';
import { CreateGroupInput } from '../shared/schemas/CreateGroupSchema.js';
import { generateUniqueGroupCode } from './utils/generateUniqueGroupCode.js';
import { removeGroupsFromUsers } from './utils/removeGroupsFromUsers.js';

export const updateGroupById = async (
  groupId: string,
  data: UpdateGroupInput
) => {
  const updatedGroup = await Group.findByIdAndUpdate(groupId, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedGroup) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND);
  }

  return updatedGroup;
};

export const isUserInGroup = async (
  groupId: string,
  userId: string
): Promise<boolean> => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('Group not found or inactive.', StatusCodes.NOT_FOUND);
  }

  return group.users.some((entry) => entry.user.equals(userId));
};

export const joinGroupByCode = async (
  code: string,
  userId: string
): Promise<{ message: string; group: GroupDoc }> => {
  const group = await Group.findOne({ code });

  if (!group) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND);
  }

  const alreadyInGroup = await isUserInGroup(group._id.toString(), userId);

  if (!alreadyInGroup) {
    const user = await User.findById(userId);

    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

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

export const leaveGroupsByIds = async (
  groupIds: string[],
  userId: string
): Promise<{
  message: string;
  leftGroupNames: string[];
  failedGroups: { id: string; name: string; reason: string }[];
  userId: string;
}> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  const leftGroupNames: string[] = [];
  const failedGroups: { id: string; name: string; reason: string }[] = [];

  for (const groupId of groupIds) {
    const group = await Group.findById(groupId);
    if (!group) continue;

    const userEntry = group.users.find((entry: any) =>
      entry.user.equals(userId)
    );
    if (!userEntry) continue;

    const isOnlyUser = group.users.length === 1;

    const isOnlyAdmin =
      userEntry.role === 'admin' &&
      group.users.filter((entry: any) => entry.role === 'admin').length === 1;

    if (isOnlyAdmin && !isOnlyUser) {
      failedGroups.push({
        id: group._id.toString(),
        name: group.name,
        reason: 'You are the only admin. Please promote another member before leaving.',
      });
      continue;
    }

    group.users = group.users.filter((entry: any) => !entry.user.equals(userId));
    if (group.userCount === 0) {
      group.active = false;
      await removeGroupsFromUsers(group._id.toString());
    }

    await group.save();

    user.groups = user.groups.filter(
      (gId: Types.ObjectId) => gId.toString() !== groupId
    );
    leftGroupNames.push(group.name);
  }

  await user.save();

  return {
    message: `Left ${leftGroupNames.length} group${leftGroupNames.length !== 1 ? 's' : ''} successfully.`,
    leftGroupNames,
    failedGroups,
    userId,
  };
};

type CreateGroupData = CreateGroupInput & {
  code: string;
  users: {
    user: string;
    role: 'admin' | 'member';
  }[];
};

export const createGroupForUser = async (
  userId: string,
  groupInput: CreateGroupInput
): Promise<GroupDoc> => {
  const data: CreateGroupData = {
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

type PopulatedGroupMember = {
  user: UserDoc
  role: 'admin' | 'member';
};

export const updateGroupMemberRoles = async (
  groupId: string,
  userIds: string[],
  newRole: 'admin' | 'member'
): Promise<{
  alreadyInRole: string[];
  updatedUsers: string[];
}> => {
  const group = await Group.findById(groupId)
    .populate<{ users: PopulatedGroupMember[] }>('users.user', 'username');

  if (!group) throw new Error('Group not found');

  const alreadyInRole: string[] = [];
  const updatedUsers: string[] = [];

  group.users.forEach((member) => {
    const user = member.user;

    if (userIds.includes(user._id.toString())) {
      if (member.role === newRole) {
        alreadyInRole.push(user.username);
      } else {
        member.role = newRole;
        updatedUsers.push(user.username);
      }
    }
  });

  await group.save();

  return { alreadyInRole, updatedUsers };
};

export const removeMembers = async (
  groupId: string,
  userIds: string[]
) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  group.users = group.users.filter(
    (member) => !userIds.includes(member.user.toString())
  );

  await group.save();

  await User.updateMany(
    { _id: { $in: userIds.map((id) => new Types.ObjectId(id)) } },
    { $pull: { groups: group._id } }
  );
};