import { useMutation } from '@tanstack/react-query';
import { useAxiosPrivate } from './useAxiosPrivate';
import type { JoinGroupInput } from '@/shared/schemas/JoinGroupSchema';
import { useNavigate } from '@tanstack/react-router';
import { showNotification } from '@mantine/notifications';

export const useJoinGroup = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: JoinGroupInput) => {
      const res = await axiosPrivate.post('/groups/join', data);
      return res.data;
    },
    onSuccess: (data) => {
      showNotification({
        title: 'Success',
        message: `Joined group: ${data.group.name}`,
        color: 'green',
      });
      navigate({ to: '/groups' });
    },
    onError: (error: any) => {
      showNotification({
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to join group',
        color: 'red',
      });
    },
  });
};
