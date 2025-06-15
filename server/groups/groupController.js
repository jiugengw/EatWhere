import Group from './groupModel.js';

import catchAsync from '../utils/catchAsync.js';

export const createGroup = catchAsync(async (req, res, next) => {
  const newGroup = await Group.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      group: newGroup,
    },
  });
});
