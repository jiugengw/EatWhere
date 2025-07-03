import { StatusCodes } from 'http-status-codes';
import { Group } from './groupModel.js';
import { createGroupForUser, isUserInGroup, joinGroupByCode, 
// leaveGroupById,
updateGroupById, } from './groupService.js';
import { AppError } from '../common/utils/AppError.js';
import { catchAsync } from '../common/utils/catchAsync.js';
import { getOne, deleteOne } from '../common/utils/handlerFactory.js';
import { UpdateGroupSchema } from '../shared/schemas/UpdateGroupSchema.js';
import { User } from '../users/userModel.js';
import { CreateGroupSchema } from '../shared/schemas/CreateGroupSchema.js';
import { JoinGroupSchema } from '../shared/schemas/JoinGroupSchema.js';
export const getGroup = getOne(Group, {
    populateOptions: {
        path: 'users.user',
        select: 'username fullName firstName lastName email',
    },
});
export const updateGroup = catchAsync(async (req, res, next) => {
    const parsed = UpdateGroupSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError('Validation failed', StatusCodes.BAD_REQUEST, parsed.error.flatten().fieldErrors));
    }
    const updatedGroup = await updateGroupById(req.params.id, parsed.data);
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            group: updatedGroup,
        },
    });
});
export const deleteGroup = deleteOne(Group, {
    postDeleteFn: async (group) => {
        await User.updateMany({ groups: group.id }, { $pull: { groups: group.id } });
    },
});
// export const getGroupHistory: RequestHandler = getOne(Group, {
//   populateOptions: { path: 'history' },
//   selectFields: 'history',
// });
export const getGroupUsers = getOne(Group, {
    populateOptions: { path: 'users' },
    selectFields: 'users',
});
export const getGroupByCode = getOne(Group, {
    populateOptions: {
        path: 'users',
        select: '_id',
    },
    findByFn: (req) => ({ code: req.params.code }),
});
export const checkUserInGroup = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }
    const isMember = await isUserInGroup(req.params.id, req.user.id);
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            isMember,
        },
    });
});
export const joinGroup = catchAsync(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }
    console.log(req);
    const parsed = JoinGroupSchema.safeParse(req.params);
    if (!parsed.success) {
        console.log('Validation errors:', parsed.error.flatten().fieldErrors);
        return next(new AppError('Validation failed', StatusCodes.BAD_REQUEST, parsed.error.flatten().fieldErrors));
    }
    const { code } = parsed.data;
    const { message, group } = await joinGroupByCode(code, req.user.id);
    res.status(StatusCodes.OK).json({
        status: 'success',
        message,
        data: { Group: group },
    });
});
// export const leaveGroup = catchAsync(async (req, res, next) => {
//   if (!req.user) {
//     return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
//   }
//   const { message, groupId, userId } = await leaveGroupById(
//     req.params.id,
//     req.user.id
//   );
//   res.status(StatusCodes.OK).json({
//     status: 'success',
//     message,
//     data: { groupId, userId },
//   });
// });
export const createGroup = catchAsync(async (req, res, next) => {
    const parsed = CreateGroupSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError('Group creation validation failed', StatusCodes.BAD_REQUEST, parsed.error.flatten().fieldErrors));
    }
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }
    const newGroup = await createGroupForUser(req.user.id, parsed.data);
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: { Group: newGroup },
    });
});
