import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;
const groupSchema = new Schema({
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
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
    timestamps: true,
    versionKey: false,
});
// groupSchema.virtual('history', {
//   ref: 'History',
//   foreignField: 'group',
//   localField: '_id',
// });
groupSchema.virtual('userCount').get(function () {
    return this.users?.length || 0;
});
groupSchema.pre(/^find/, function (next) {
    this.find({ active: true });
    next();
});
export const Group = models.Group || model('Group', groupSchema);
