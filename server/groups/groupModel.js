import mongoose from 'mongoose';
import User from './../users/userModel.js';
import * as groupService from './groupService.js';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    code: {
      type: String,
      unique: [true, 'Code must be unique'],
    },
    users: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: [],
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
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

groupSchema.virtual('history', {
  ref: 'History',
  foreignField: 'group',
  localField: '_id',
});

groupSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      let codeAvail;
      let code;
      while (!codeAvail) {
        code = groupService.generateCode(8);
        const group = await mongoose.models.Group.findOne({ code });
        if (!group) codeAvail = true;
      }
      this.code = code;
    }

    next();
  } catch (err) {
    next(err);
  }
});

groupSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});


export default mongoose.model('Group', groupSchema);
