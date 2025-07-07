import mongoose, { Schema, Document } from 'mongoose';
import { CuisineType } from './types.js';

export interface IUserPreferences extends Document {
  userId: string;
  
  manualPreferences: {
    [K in CuisineType]: number;
  };
  
  hiddenAdjustments: {
    [K in CuisineType]: number;
  };
  
  totalRatings: number;
  adaptationRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const cuisineDefaults = {
  Chinese: { type: Number, default: 0, min: -2, max: 2 },
  Korean: { type: Number, default: 0, min: -2, max: 2 },
  Japanese: { type: Number, default: 0, min: -2, max: 2 },
  Italian: { type: Number, default: 0, min: -2, max: 2 },
  Mexican: { type: Number, default: 0, min: -2, max: 2 },
  Indian: { type: Number, default: 0, min: -2, max: 2 },
  Thai: { type: Number, default: 0, min: -2, max: 2 },
  French: { type: Number, default: 0, min: -2, max: 2 },
  Muslim: { type: Number, default: 0, min: -2, max: 2 },
  Vietnamese: { type: Number, default: 0, min: -2, max: 2 },
  Western: { type: Number, default: 0, min: -2, max: 2 },
  'Fast Food': { type: Number, default: 0, min: -2, max: 2 }
};

const hiddenAdjustmentDefaults = {
  Chinese: { type: Number, default: 0, min: -2, max: 2 },
  Korean: { type: Number, default: 0, min: -2, max: 2 },
  Japanese: { type: Number, default: 0, min: -2, max: 2 },
  Italian: { type: Number, default: 0, min: -2, max: 2 },
  Mexican: { type: Number, default: 0, min: -2, max: 2 },
  Indian: { type: Number, default: 0, min: -2, max: 2 },
  Thai: { type: Number, default: 0, min: -2, max: 2 },
  French: { type: Number, default: 0, min: -2, max: 2 },
  Muslim: { type: Number, default: 0, min: -2, max: 2 },
  Vietnamese: { type: Number, default: 0, min: -2, max: 2 },
  Western: { type: Number, default: 0, min: -2, max: 2 },
  'Fast Food': { type: Number, default: 0, min: -2, max: 2 }
};

const UserPreferencesSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  manualPreferences: cuisineDefaults,
  hiddenAdjustments: hiddenAdjustmentDefaults,
  
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  adaptationRate: {
    type: Number,
    default: 0.3,
    min: 0.1,
    max: 0.5
  }
}, {
  timestamps: true
});

export const UserPreferences = mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema);
