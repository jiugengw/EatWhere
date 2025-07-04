import { useMutation } from '@tanstack/react-query';
import { useAxiosPrivate } from './useAxiosPrivate';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export const useRemoveGroupMembers = (id: string) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const res = await axiosPrivate.delete(`/groups/${id}/users`, {
        data: { userIds },
      });
      return res.data;
    },
    onSuccess: (data) => {
      showNotification({
        title: 'Success',
        message: data.message || 'Users removed from group.',
        color: 'green',
      });

      queryClient.invalidateQueries({ queryKey: ['group', id] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || 'Failed to remove users.',
        color: 'red',
      });
    },
  });
};