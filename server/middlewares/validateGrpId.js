import Group from './../models/groupModel.js';
import AppError from './../utils/AppError.js';
import catchAsync from './../utils/catchAsync.js';

const validateGroupCode = catchAsync(async (req, res, next) => {
  const group = await Group.findOne(req.params.code);

  if (!group) {
    return next(new AppError('Group not found', 404));
  }

  req.group = group;
  next();
});

export default validateGroupId;
