import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';
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
            const {
                status,
                partial,
                leftGroupNames = [],
                failedGroups = []
            } = data;

            const left = leftGroupNames.length
                ? `Left: ${leftGroupNames.join(', ')}.`
                : '';

            const failed = failedGroups.length
                ? `Failed: ${failedGroups
                    .map((g: { name: string; reason: string }) => `${g.name} (${g.reason})`)
                    .join(', ')}.`
                : '';

            const title =
                status === 'fail'
                    ? 'Leave Failed'
                    : partial
                        ? 'Partial Success'
                        : 'Success';

            const color =
                status === 'fail'
                    ? 'red'
                    : partial
                        ? 'yellow'
                        : 'green';

            const message = (
                <div>
                    {left && <div>{left}</div>}
                    {failed && <div>{failed}</div>}
                    {!left && !failed && <div>Left groups successfully.</div>}
                </div>
            );

            showNotification({ title, message, color });

            queryClient.invalidateQueries({ queryKey: ['viewGroups'] });
        },
        onError: (error: unknown) => {
            const err = error as AxiosError<{
                message?: string;
                data?: {
                    failedGroups?: { name: string; reason: string }[];
                };
            }>;

            const failedGroups = err?.response?.data?.data?.failedGroups || [];

            const failedList = failedGroups.length
                ? failedGroups.map((g) => `${g.name} (${g.reason})`).join(', ')
                : '';

            const fallbackMessage = err?.response?.data?.message || 'Failed to leave groups.';

            const message = failedList
                ? `Failed to leave: ${failedList}.`
                : fallbackMessage;

            showNotification({
                title: 'Error',
                message,
                color: 'red',
            });
        },
    });
};