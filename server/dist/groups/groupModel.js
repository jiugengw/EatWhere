import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;
const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    code: {
        type: String,
        unique: true,
        required: true,
        length: 6,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    users: {
        type: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                role: {
                    type: String,
                    enum: ['admin', 'member'],
                    default: 'member',
                },
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
