import type { GroupMember } from "@/types/apiResponse";
import { useAuth } from "./useAuth";

// WRONG CAUSE SHOULDNT THROW ERROR JIC STILL LOADING
// export const useGroupRole = (
//     groupUsers: GroupMember[]
// ): { role: 'admin' | 'member'; isAdmin: boolean } => {
//     const { auth } = useAuth();
//     const currentUserId = auth?.id;

//     const member = groupUsers.find((m) => m.user._id === currentUserId);

//     if (!member) {
//         throw new Error('Current user is not a member of this group.');
//     }

//     const role = member.role;
//     const isAdmin = role === 'admin';

//     return { role, isAdmin };
// };

export const useGroupRole = (
  groupUsers: GroupMember[] | undefined
): { role: 'admin' | 'member' | null; isAdmin: boolean } => {
  const { auth } = useAuth();
  const currentUserId = auth?.id;

  if (!groupUsers || !currentUserId) {
    return { role: null, isAdmin: false };
  }

  const member = groupUsers.find((m) => m.user._id === currentUserId);
  const role = member?.role ?? null;
  const isAdmin = role === 'admin';

  return { role, isAdmin };
};