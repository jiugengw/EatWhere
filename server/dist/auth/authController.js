import { StatusCodes } from 'http-status-codes';
import { signToken, signupUser, loginUser, verifyAndGetUser, updateUserPassword, } from './authService.js';
import { AppError } from '../common/utils/AppError.js';
import { catchAsync } from '../common/utils/catchAsync.js';
import { LoginSchema } from '../shared/schemas/LoginSchema.js';
import { SignupSchema } from '../shared/schemas/SignupSchema.js';
import { UpdatePasswordSchema } from '../shared/schemas/UpdatePasswordSchema.js';
import { config } from '../common/utils/config.js';
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() + Number(config.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (config.NODE_ENV === 'production')
        cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    // user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            User: user,
        },
    });
};
export const signup = catchAsync(async (req, res, next) => {
    const parsed = SignupSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError('Signup validation failed', StatusCodes.BAD_REQUEST, parsed.error.flatten().fieldErrors));
    }
    const newUser = await signupUser(parsed.data);
    createSendToken(newUser, StatusCodes.CREATED, res);
});
export const login = catchAsync(async (req, res, next) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError('Login validation failed', StatusCodes.BAD_REQUEST, parsed.error.flatten().fieldErrors));
    }
    const user = await loginUser(parsed.data);
    createSendToken(user, StatusCodes.OK, res);
});
export const protect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;
    if (!token)
        return next(new AppError('You are not logged in!', StatusCodes.UNAUTHORIZED));
    const user = await verifyAndGetUser(token);
    req.user = user;
    next();
});
export const updatePassword = catchAsync(async (req, res, next) => {
    const parsed = UpdatePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return next(new AppError('Validation failed', StatusCodes.BAD_REQUEST, parsed.error.flatten().fieldErrors));
    }
    if (!req.user) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }
    const user = await updateUserPassword(req.user.id, parsed.data);
    createSendToken(user, StatusCodes.OK, res);
});
