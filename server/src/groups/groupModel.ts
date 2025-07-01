import mongoose from 'mongoose';
import { Types } from 'mongoose';
import type { Query } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

const { model, models, Schema } = mongoose;

interface IGroup {
  name: string;
  code: string;
  users: Types.ObjectId[];
  active: boolean;
}

export type GroupDoc = HydratedDocument<IGroup>;

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
    users: {
      type: [
        {
          type: Schema.Types.ObjectId,
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

// groupSchema.virtual('history', {
//   ref: 'History',
//   foreignField: 'group',
//   localField: '_id',
// });

groupSchema.virtual('userCount').get(function () {
  return this.users?.length || 0;
});

groupSchema.pre<Query<any, IGroup>>(/^find/, function (next) {
  this.find({ active: true });
  next();
});

export const Group =
  (models.Group as Model<IGroup>) || model<IGroup>('Group', groupSchema);
