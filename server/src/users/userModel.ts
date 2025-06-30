import {
  model,
  models,
  Schema,
  Types,
  HydratedDocument,
  Query,
  Model,
} from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  preferences?: Map<string, number>;
  groups: Types.ObjectId[];
  active?: boolean;
  id?: string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
}

export type UserDoc = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: Date,
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    preferences: {
      type: Map,
      of: Number,
      default: () =>
        new Map([
          ['Chinese', 0],
          ['Korean', 0],
          ['Japanese', 0],
          ['Italian', 0],
          ['Mexican', 0],
          ['Indian', 0],
          ['Thai', 0],
          ['French', 0],
          ['Muslim', 0],
          ['Vietnamese', 0],
          ['Western', 0],
          ['Fast Food', 0],
        ]),
    },
    groups: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Group',
        },
      ],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
    versionKey: false,
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// userSchema.virtual('history', {
//   ref: 'History',
//   foreignField: 'user',
//   localField: '_id',
// });

userSchema.pre<HydratedDocument<IUser>>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre<HydratedDocument<IUser>>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre<Query<any, IUser>>(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  this: HydratedDocument<IUser>,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

export const User =
  (models.User as Model<IUser>) || model<IUser>('User', userSchema);
