import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from './useAxiosPrivate';
import { useNavigate } from '@tanstack/react-router';
import { showNotification } from '@mantine/notifications';
import type { AxiosError } from 'axios';

export const useJoinGroup = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (code: string) => {
      const res = await axiosPrivate.patch(`/groups/${code}/join`);
      return res.data;
    },
    onSuccess: (data) => {
      showNotification({
        title: 'Success',
        message: `Joined group: ${data.group.name}`,
        color: 'green',
      });
      navigate({ to: '/group' });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;

      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || 'Failed to join group',
        color: 'red',
      });
    },
  });
};
