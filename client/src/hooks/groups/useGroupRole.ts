import type { GroupMember } from "@/types/apiResponse";
import { useAuth } from "../auth/useAuth";

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