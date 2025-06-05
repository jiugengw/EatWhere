import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  preferences: [
    {
      cuisine: String,
      points: Number,
    },
  ],
  avoid: [String],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group',
  },
  history: [
    {
      restaurantName: String, 
      cuisine: String, 
      date: {
        type: Date,
        default: Date.now,
      },
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
      liked: Boolean, 
      notes: String,   
    }
  ]
});

export default mongoose.model('User', userSchema);
