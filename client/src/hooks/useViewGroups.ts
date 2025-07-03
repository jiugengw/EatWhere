import { useQuery } from '@tanstack/react-query';
import { useAxiosPrivate } from './useAxiosPrivate';

export const useViewGroups = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchGroups = async () => {
    const res = await axiosPrivate.get('users/me/groups');
    console.log("Group API response:", res.data);
    return res.data;
  };

  return useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
};
