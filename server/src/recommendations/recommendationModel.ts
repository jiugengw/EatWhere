import { model, Schema, Document, type HydratedDocument, type Model } from 'mongoose';
import { CuisineType } from './types.js';

export interface IUserRecommendationData extends Document {
  userId: string;
  hiddenAdjustments: {
    [K in CuisineType]: number;
  };
  favourites: string[];
  totalRatings: number;
  adaptationRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRecommendationDoc = HydratedDocument<IUserRecommendationData>;

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

const UserRecommendationDataSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  hiddenAdjustments: hiddenAdjustmentDefaults,
  favourites: {
    type: [String],
    default: []
  },
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

export const UserRecommendationData = model<IUserRecommendationData>('UserRecommendationData', UserRecommendationDataSchema);
