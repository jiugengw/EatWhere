import { useMutation } from '@tanstack/react-query';
import { useAxiosPrivate } from '../auth/useAxiosPrivate';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export const useUpdateGroupRoles = (id: string) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { userIds: string[]; role: 'admin' | 'member' }) => {
            const res = await axiosPrivate.patch(`/groups/${id}/users/role`, payload);
            return res.data;
        },
        onSuccess: (data) => {
            showNotification({
                title: 'Success',
                message: data.message || 'Roles updated successfully.',
                color: 'green',
            });

            queryClient.invalidateQueries({ queryKey: ['group', id] });
        },
        onError: (error: unknown) => {
            const err = error as AxiosError<{ message: string }>;
            showNotification({
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to update roles.',
                color: 'red',
            });
        },
    });
};