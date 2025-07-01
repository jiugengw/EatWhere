import { StatusCodes } from 'http-status-codes';
import { User } from './userModel.js';
import { AppError } from '../common/utils/AppError.js';
export const updateUserPreferences = async (userId, newPreferences) => {
    const updateOptions = {};
    newPreferences.forEach(({ cuisine, points }) => {
        updateOptions[`preferences.${cuisine}`] = Number(points);
    });
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateOptions }, { new: true, runValidators: true });
    if (!updatedUser) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return updatedUser;
};
export const updateUserProfile = async (userId, data) => {
    if (data.username) {
        const existingUser = await User.findOne({
            username: data.username,
            _id: { $ne: userId },
        });
        if (existingUser) {
            throw new AppError('Username already taken', StatusCodes.BAD_REQUEST);
        }
    }
    if (data.email) {
        const existingUser = await User.findOne({
            email: data.email,
            _id: { $ne: userId },
        });
        if (existingUser) {
            throw new AppError('Email already taken', StatusCodes.BAD_REQUEST);
        }
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return updatedUser;
};
