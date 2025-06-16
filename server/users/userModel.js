import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Userame is required.'],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => !validator.isEmpty(value.trim()),
        message: 'Username cannot be empty or just spaces',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email is invalid.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      maxlength: [32, 'Password must be at most 32 characters.'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    firstName: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !validator.isEmpty(value.trim()),
        message: 'First name cannot be empty or just spaces.',
      },
    },
    lastName: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !validator.isEmpty(value.trim()),
        message: 'Last name cannot be empty or just spaces',
      },
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
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('history', {
  ref: 'History',
  foreignField: 'user',
  localField: '_id',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

export default mongoose.model('User', userSchema);
