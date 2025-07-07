import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { modals } from '@mantine/modals';
import { useNavigate } from '@tanstack/react-router';

export const useLeaveGroup = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosPrivate.patch(`/groups/${id}/leave`);
      return res.data;
    },
    onSuccess: (data) => {
      showNotification({
        title: 'Left Group',
        message: data.message || 'Successfully left the group',
        color: 'green',
      });

      queryClient.invalidateQueries({ queryKey: ['viewGroups'] });
      queryClient.invalidateQueries({ queryKey: ['group'] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || 'Failed to leave group',
        color: 'red',
      });
    },
  });

  const handleLeaveGroup = (groupId: string, groupName: string, userCount: number, redirectAfterLeave = false) => {
    if (userCount === 1) {
      modals.openConfirmModal({
        title: 'Delete Group?',
        children: `You are the last member in "${groupName}". Leaving will permanently delete this group. Continue?`,
        labels: { confirm: 'Yes, delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => {
          mutation.mutate(groupId);
          if (redirectAfterLeave) {
            navigate({ to: '/group' });
          }
        },
      });
    } else {
      modals.openConfirmModal({
        title: 'Leave Group?',
        children: `Are you sure you want to leave "${groupName}"?`,
        labels: { confirm: 'Yes, leave', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => {
          mutation.mutate(groupId);
          if (redirectAfterLeave) {
            navigate({ to: '/group' });
          }
        },
      });
    }
  };

  return {
    handleLeaveGroup,
    isLoading: mutation.isPending,
  };
};