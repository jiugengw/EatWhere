import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useNavigate } from '@tanstack/react-router';
import type { SignupInput } from '@/shared/schemas/SignupSchema';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupInput) => {
      const res = await api.post('/users/signup', data);
      return res.data;
    },
    onSuccess: () => {
      navigate({ to: '/' });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;

      showNotification({
        title: 'Signup failed',
        message:
          err?.response?.data?.message ||
          'Something went wrong. Please try again.',
        color: 'red',
      });

      console.error('Signup failed:', error);
    },
  });
};
