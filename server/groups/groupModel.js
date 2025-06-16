import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import User from './../users/userModel.js';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

groupSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      let codeAvail;
      let code;
      while (!codeAvail) {
        code = nanoid(6);
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

groupSchema.post('save', async function () {
  const userAdded = this.users.at(-1);
  const group = this;

  if (!userAdded) return;
  
  await User.findByIdAndUpdate(userAdded, {
    $addToSet: { groups: group.id },
  });
});

export default mongoose.model('Group', groupSchema);
