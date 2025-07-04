import { User } from '../../users/userModel.js';

export const removeGroupsFromUsers = async (groupId: string) => {
    await User.updateMany({ groups: groupId }, { $pull: { groups: groupId } });
};