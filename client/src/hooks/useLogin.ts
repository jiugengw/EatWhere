import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useNavigate } from '@tanstack/react-router';
import type { LoginInput } from '@/shared/schemas/LoginSchema';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post('/users/login', data);
      return res.data;
    },
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};
