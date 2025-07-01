import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { config } from '../common/utils/config.js';
import { AppError } from '../common/utils/AppError.js';
import { isEmail } from '../common/utils/isEmail.js';
import { User } from '../users/userModel.js';
export const signToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
        algorithm: 'HS256',
    });
};
export const signAccessToken = (id, name) => {
    return jwt.sign({ id, name }, config.JWT_SECRET, {
        expiresIn: "10s",
    });
};
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err || typeof decoded !== 'object' || !('id' in decoded)) {
                return reject(new AppError('Invalid token payload', StatusCodes.UNAUTHORIZED));
            }
            resolve(decoded);
        });
    });
};
export const verifyAndGetUser = async (token) => {
    const decoded = await verifyToken(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError('User no longer exists.', StatusCodes.UNAUTHORIZED);
    }
    if (!decoded.iat || user.changedPasswordAfter(decoded.iat)) {
        throw new AppError('Password changed after token was issued.', StatusCodes.UNAUTHORIZED);
    }
    return user;
};
export const signupUser = async (data) => {
    const existingUser = await User.findOne({
        $or: [{ email: data.email }, { username: data.username }],
    });
    if (existingUser) {
        throw new AppError('Email or username already exists', 409);
    }
    const newUser = await User.create(data);
    return newUser;
};
export const loginUser = async (data) => {
    const { usernameOrEmail, password } = data;
    const queryField = isEmail(usernameOrEmail) ? 'email' : 'username';
    const user = await User.findOne({ [queryField]: usernameOrEmail }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Incorrect username/email or password!', StatusCodes.UNAUTHORIZED);
    }
    return user;
};
export const updateUserPassword = async (userId, data) => {
    const { passwordCurrent, passwordNew, passwordConfirm } = data;
    const user = await User.findById(userId).select('+password');
    if (!user || !(await user.correctPassword(passwordCurrent, user.password))) {
        throw new AppError('Your current password is wrong!', StatusCodes.UNAUTHORIZED);
    }
    user.password = passwordNew;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    return user;
};
