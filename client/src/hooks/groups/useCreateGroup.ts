import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError } from 'axios';

import type { CreateGroupInput } from '@/shared/schemas/CreateGroupSchema';
import { useAxiosPrivate } from '@/hooks/auth/useAxiosPrivate';

export const useCreateGroup = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateGroupInput) => {
      const res = await axiosPrivate.post('/groups', data);
      return res.data;
    },

    onSuccess: (data) => {
      showNotification({
        title: 'Group Created',
        message: `Welcome to "${data.data.Group.name}"`,
        color: 'green',
      });

      navigate({ to: `/group` });
    },

    onError: (error) => {
      const err = error as AxiosError<{ message: string }>;

      showNotification({
        title: 'Failed to create group',
        message: err?.response?.data?.message || 'Something went wrong.',
        color: 'red',
      });

      console.error('Create group error:', error);
    },
  });
};
