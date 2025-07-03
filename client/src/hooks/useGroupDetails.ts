import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useAxiosPrivate } from './useAxiosPrivate';
import type { GroupDetailResponse } from '@/types/apiResponse';

export const useGroupDetails = (id: string): UseQueryResult<GroupDetailResponse, unknown> => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      const res = await axiosPrivate.get<GroupDetailResponse>(`/groups/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};