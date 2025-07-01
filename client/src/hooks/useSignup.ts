import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useNavigate } from '@tanstack/react-router';
import type { SignupInput } from '@/shared/schemas/SignupSchema';

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupInput) => {
      const res = await api.post('/users/signup', data);
      return res.data;
    },
    onSuccess: () => {
      navigate({ to: '/login' });
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};
