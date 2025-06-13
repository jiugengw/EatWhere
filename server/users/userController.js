import User from './userModel.js';
import * as factory from './../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';

export const createUser = factory.createOne(User);
export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);
// not for updating passwords
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

export const getUserHistory = factory.getOne(User, 'history', 'history');
export const getUserGroups = factory.getOne(User, 'groups', 'groups');
export const getUserPreferences = factory.getOne(User, null, 'preferences');

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(StatusCodes.NO_CONTENT).end();
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    'username',
    'email',
    'firstName',
    'lastName'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
