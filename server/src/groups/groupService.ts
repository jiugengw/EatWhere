import { StatusCodes } from 'http-status-codes';
import { Group, GroupDoc } from './groupModel.js';
import { Types } from 'mongoose';
import { AppError } from '../common/utils/AppError.js';
import { UpdateGroupInput } from '../shared/schemas/UpdateGroupSchema.js';
import { User, type UserDoc } from '../users/userModel.js';
import { CreateGroupInput } from '../shared/schemas/CreateGroupSchema.js';
import { generateUniqueGroupCode } from './utils/generateUniqueGroupCode.js';

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
  console.log(code);
  const group = await Group.findOne({ code });

  if (!group) {
    throw new AppError('Group not found', StatusCodes.NOT_FOUND);
  }

  const alreadyInGroup = await isUserInGroup(group._id.toString(), userId);

  if (!alreadyInGroup) {
    const user = await User.findById(userId);

    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    group.users.push({
      user: new Types.ObjectId(userId),
      role: 'member',
      groupInfluence: {
        currentInfluence: 1.0,
        lastChosenCuisines: [],
        satisfactionLevel: 1.0
      }
    });
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

export const leaveGroupById = async (
  groupId: string,
  userId: string
): Promise<{
  leftGroupName?: string;
  error?: string;
}> => {
  const user = await User.findById(userId);
  if (!user) {
    return { error: 'User not found' };
  }

  const group = await Group.findById(groupId);
  if (!group) {
    return { error: 'Group not found' };
  }

  const userEntry = group.users.find((entry: any) =>
    entry.user.equals(userId)
  );

  if (!userEntry) {
    return { error: 'You are not a member of this group' };
  }

  const isOnlyUser = group.users.length === 1;
  const isOnlyAdmin =
    userEntry.role === 'admin' &&
    group.users.filter((entry: any) => entry.role === 'admin').length === 1;

  if (isOnlyAdmin && !isOnlyUser) {
    return {
      error: 'You are the only admin. Please promote another member before leaving.'
    };
  }

  group.users = group.users.filter((entry: any) => !entry.user.equals(userId));

  if (group.users.length === 0) {
    group.active = false;
  }

  await group.save();

  user.groups = user.groups.filter(
    (gId: Types.ObjectId) => gId.toString() !== groupId
  );
  await user.save();

  return { leftGroupName: group.name };
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

export const updateGroupInfluences = async (
  groupId: string,
  chosenCuisines: string[]
): Promise<void> => {
  const group = await Group.findById(groupId).populate('users.user');
  if (!group) throw new Error('Group not found');

  const userIds = group.users.map(member => member.user._id);
  const users = await User.find({ _id: { $in: userIds } });

  // Create a map for quick user lookup
  const userMap = new Map(users.map(user => [user._id.toString(), user]));

  for (const groupMember of group.users) {
    const user = userMap.get(groupMember.user._id.toString());
    if (!user) continue;

    let newInfluence = groupMember.groupInfluence.currentInfluence;

    for (const chosenCuisine of chosenCuisines) {
      const userCuisineScore = calculateUserCuisineScore(user, chosenCuisine);

      if (userCuisineScore >= 4.0) {
        // High preference + this cuisine chosen = reduce influence
        newInfluence -= 0.15;
      } else if (userCuisineScore <= 2.5) {
        // Low preference + this cuisine chosen = increase influence (they sacrificed)
        newInfluence += 0.2;
      }
      // Medium preference (2.5-4.0) = neutral, no change
    }

    // Clamp influence between 0.5 and 1.5
    newInfluence = Math.max(0.5, Math.min(1.5, newInfluence));

    // Update group member's influence
    groupMember.groupInfluence.currentInfluence = newInfluence;
    groupMember.groupInfluence.lastChosenCuisines = [
      ...chosenCuisines,
      ...groupMember.groupInfluence.lastChosenCuisines
    ].slice(0, 3); // Keep only last 3
  }

  await group.save();
  console.log(`Updated influences for group ${groupId} after choosing: ${chosenCuisines.join(', ')}`);
};

// CALCULATE USER'S CUISINE SCORE
function calculateUserCuisineScore(user: UserDoc, cuisine: string): number {
  const preference = user.preferences.get(cuisine) || 3;
  const weight = user.cuisineWeights?.get(cuisine) || 1.0;
  return preference * weight;
}

// GET GROUP TOP CUISINES WITH INFLUENCE WEIGHTING
export const getGroupTopCuisinesWithInfluence = async (groupId: string): Promise<Array<{ cuisine: string, score: number }>> => {
  const group = await Group.findById(groupId).populate('users.user');
  if (!group) throw new Error('Group not found');

  const userIds = group.users.map(member => member.user._id);
  const users = await User.find({ _id: { $in: userIds } });

  // Create map for quick user lookup
  const userMap = new Map(users.map(user => [user._id.toString(), user]));

  const CUISINES = [
    'Chinese', 'Korean', 'Japanese', 'Italian', 'Mexican',
    'Indian', 'Thai', 'French', 'Muslim', 'Vietnamese', 'Western', 'Fast Food'
  ];

  const topCuisines: Array<{ cuisine: string, score: number }> = [];

  // Calculate influence-weighted score for each cuisine
  for (const cuisine of CUISINES) {
    let weightedScoreSum = 0;
    let totalInfluence = 0;

    for (const groupMember of group.users) {
      const user = userMap.get(groupMember.user._id.toString());
      if (!user) continue;

      const preference = user.preferences.get(cuisine) || 3;
      const cuisineWeight = user.cuisineWeights?.get(cuisine) || 1.0;
      const groupInfluence = groupMember.groupInfluence.currentInfluence;

      const userScore = preference * cuisineWeight;
      const influencedScore = userScore * groupInfluence;

      weightedScoreSum += influencedScore;
      totalInfluence += groupInfluence;
    }

    const avgScore = totalInfluence > 0 ? weightedScoreSum / totalInfluence : 3;

    topCuisines.push({
      cuisine,
      score: Number(avgScore.toFixed(2))
    });
  }

  // Sort by score (highest first) and return top cuisines
  return topCuisines
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Return top 6 for flexibility
};