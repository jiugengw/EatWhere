import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    restaurant: {
      placeId: String,
      name: String,
      cuisine: String,
    },
    userOpinion: [
      {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        notes: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('History', historySchema);
