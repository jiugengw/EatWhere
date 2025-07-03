import { useQuery } from '@tanstack/react-query';
import { useAxiosPrivate } from './useAxiosPrivate';

export const useViewGroups = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchGroups = async () => {
    const res = await axiosPrivate.get('users/me/groups');
    return res.data;
  };

  return useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
};
