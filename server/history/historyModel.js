import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    restaurant: {
      type: new mongoose.Schema({
        placeId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        cuisine: {
          type: String,
          required: true,
        },
      }),
      required: [true, 'Restaurant is required'],
    },
    userOpinion: {
      type: new mongoose.Schema({
        rating: {
          type: Number,
          required: [true, 'Rating is required'],
          min: [1, 'Rating must be at least 1'],
          max: [10, 'Rating cannot be above 10'],
        },
        notes: {
          type: String,
          required: [true, 'Notes are required'],
          trim: true,
          minlength: [5, 'Notes must be at least 5 characters'],
          maxlength: [200, 'Notes must be at least 200 characters'],
        },
      }),
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('History', historySchema);

