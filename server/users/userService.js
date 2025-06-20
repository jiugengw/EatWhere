import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import filterObj from './../utils/filterObj.js';
import User from './userModel.js';

export const updateUserPreferences = async (userId, newPreferences) => {
  const updateOptions = {};

  newPreferences.forEach((pref) => {
    const { cuisine, points } = pref;
    updateOptions[`preferences.${cuisine}`] = Number(points);
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateOptions },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return updatedUser;
};
