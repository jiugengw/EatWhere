import { model, models, Schema, } from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new Schema({
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
        default: () => new Map([
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
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// userSchema.virtual('history', {
//   ref: 'History',
//   foreignField: 'user',
//   localField: '_id',
// });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
userSchema.pre(/^find/, function (next) {
    this.find({ active: true });
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
export const User = models.User || model('User', userSchema);
