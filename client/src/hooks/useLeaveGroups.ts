import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosPrivate } from './useAxiosPrivate';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';

export const useLeaveGroups = () => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            const res = await axiosPrivate.patch('/groups/leave', {
                groupIds: ids,
            });
            return res.data;
        },
        onSuccess: (data) => {
            const { message, data: responseData } = data;
            const { leftGroupNames = [], failedGroups = [] } = responseData || {};

            const left = leftGroupNames.length
                ? `Left: ${leftGroupNames.join(', ')}.`
                : '';

            const failed = failedGroups.length
                ? `Failed: ${failedGroups
                    .map((g: { name: string; reason: string }) => `${g.name} (${g.reason})`)
                    .join(', ')}.`
                : '';

            showNotification({
                title:
                    failedGroups.length > 0
                        ? leftGroupNames.length > 0
                            ? 'Partial Success'
                            : 'Leave Failed'
                        : 'Success',
                message: `${left} ${failed}` || message || 'Left groups successfully.',
                color:
                    failedGroups.length > 0
                        ? leftGroupNames.length > 0
                            ? 'yellow'
                            : 'red'
                        : 'green',
            });

            queryClient.invalidateQueries({ queryKey: ['viewGroups'] });
        },
        onError: (error: unknown) => {
            const err = error as AxiosError<{ message: string }>;
            showNotification({
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to leave groups.',
                color: 'red',
            });
        },
    });
};