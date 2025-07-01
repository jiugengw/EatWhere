import jwt from 'jsonwebtoken';
import { config } from '../common/utils/config.js';
import { AppError } from '../common/utils/AppError.js';
import { catchAsync } from '../common/utils/catchAsync.js';
import { StatusCodes } from 'http-status-codes';
import { User } from '../users/userModel.js';
export const handleRefreshToken = catchAsync(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return next(new AppError('No refresh token found.', StatusCodes.UNAUTHORIZED));
    }
    const refreshToken = cookies.jwt;
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    }
    catch (err) {
        return next(new AppError('Invalid or expired refresh token.', StatusCodes.FORBIDDEN));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('User not found.', StatusCodes.UNAUTHORIZED));
    }
    const newAccessToken = jwt.sign({ id: user._id, name: user.firstName }, config.JWT_SECRET, { expiresIn: '10s' });
    res.status(StatusCodes.OK).json({
        token: newAccessToken,
    });
});
export const logout = catchAsync(async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    res
        .status(StatusCodes.OK)
        .json({ message: 'Logged out successfully' });
});
