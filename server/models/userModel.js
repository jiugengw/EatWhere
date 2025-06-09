import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Userame is required'],
      unique: true,
      trim: true,
      validate: {
        validator: (val) => val.trim().length > 0,
        message: 'Username cannot be empty or just spaces',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    firstName: {
      type: String,
      trim: true,
      validate: {
        validator: (val) => val.trim().length > 0,
        message: 'First name cannot be empty or just spaces',
      },
    },
    lastName: {
      type: String,
      trim: true,
      validate: {
        validator: (val) => val.trim().length > 0,
        message: 'Last name cannot be empty or just spaces',
      },
    },
    preferences: {
      type: [
        {
          cuisine: {
            type: String,
            required: true,
          },
          points: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    //   history: {
    //     type: [
    //       {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'History',
    //       },
    //     ],
    //     default: [],
    //   },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('User', userSchema);
