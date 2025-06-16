import Group from './groupModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from '../utils/handlerFactory.js';
import { StatusCodes } from 'http-status-codes';

export const createGroup = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const user = req.user;

  const newGroup = await Group.create({ name, users: [user._id] });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      group: newGroup,
    },
  });
});

export const getGroupByCode = factory.getOne({
  Model: Group,
  populateOptions: { path: 'users', select: 'username firstName lastName' },
  findByFn: (req) => ({ code: req.params.code }),
  dataKey: 'group',
});

