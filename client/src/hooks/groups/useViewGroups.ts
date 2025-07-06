import { useQuery } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';
import type { ViewGroupsResponse } from '@/types/apiResponse';

export const useViewGroups = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchGroups = async (): Promise<ViewGroupsResponse> => {
    const res = await axiosPrivate.get('/users/me/groups');
    return res.data;
  };

  return useQuery<ViewGroupsResponse>({ queryKey: ['viewGroups'], queryFn: fetchGroups });
};