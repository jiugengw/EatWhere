import { AppError } from '@/common/utils/AppError.js';
import type { UserDoc } from '@/users/userModel.js';
import { User } from '@/users/userModel.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { config } from '@/common/utils/config';
import type { SignupInput } from 'shared/schemas/SignupSchema';
import { isEmail } from '@/common/utils/isEmail';
import { LoginInput } from 'shared/schemas/LoginSchema';
import { UpdatePasswordInput } from 'shared/schemas/UpdatePasswordSchema';

export const signToken = (id: string): string => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

type TokenPayload = JwtPayload & { id: string };

const verifyToken = (token: string, secret: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || typeof decoded !== 'object' || !('id' in decoded)) {
        return reject(
          new AppError('Invalid token payload', StatusCodes.UNAUTHORIZED)
        );
      }
      resolve(decoded as TokenPayload);
    });
  });
};

export const verifyAndGetUser = async (token: string): Promise<UserDoc> => {
  const decoded = await verifyToken(token, config.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists.', StatusCodes.UNAUTHORIZED);
  }

  if (!decoded.iat || user.changedPasswordAfter(decoded.iat)) {
    throw new AppError(
      'Password changed after token was issued.',
      StatusCodes.UNAUTHORIZED
    );
  }

  return user;
};

export const signupUser = async (data: SignupInput): Promise<UserDoc> => {
  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });

  if (existingUser) {
    throw new AppError('Email or username already exists', 409);
  }

  const newUser = await User.create(data);

  return newUser;
};

export const loginUser = async (data: LoginInput): Promise<UserDoc> => {
  const { usernameOrEmail, password } = data;
  const queryField = isEmail(usernameOrEmail) ? 'email' : 'username';
  const user = await User.findOne({ [queryField]: usernameOrEmail }).select(
    '+password'
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError(
      'Incorrect username/email or password!',
      StatusCodes.UNAUTHORIZED
    );
  }

  return user;
};

export const updateUserPassword = async (
  userId: string,
  data: UpdatePasswordInput
): Promise<UserDoc> => {
  const { passwordCurrent, passwordNew, passwordConfirm } = data;

  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.correctPassword(passwordCurrent, user.password))) {
    throw new AppError(
      'Your current password is wrong!',
      StatusCodes.UNAUTHORIZED
    );
  }

  user.password = passwordNew;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  return user;
};
