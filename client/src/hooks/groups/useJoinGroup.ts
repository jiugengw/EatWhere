import { useMutation } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';
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
      console.log('Success:', data);
      const groupName = data.data.Group.name;
      const message = data.message;

      const isAlreadyInGroup = message.includes('already');

      showNotification({
        title: isAlreadyInGroup ? 'Already Joined' : 'Success',
        message: isAlreadyInGroup
          ? `You're already a member of "${groupName}"`
          : `Joined group: ${groupName}`,
        color: isAlreadyInGroup ? 'yellow' : 'green',
      });

      navigate({ to: '/group' });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || 'Failed to join group',
        color: 'red',
      });
    },
  });
};
