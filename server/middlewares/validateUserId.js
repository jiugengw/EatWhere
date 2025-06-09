import User from './../models/userModel.js';
import AppError from './../utils/AppError.js';
import catchAsync from './../utils/catchAsync.js';

const validateUserId = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});

export default validateUserId;
