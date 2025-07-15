export interface RecommendationResult {
  cuisineName: string;
  score: number;
  confidenceLevel?: number;
  discoveryLevel?: number;
  reasoning: string;
}

export interface RecommendationResponse {
  recommendations: RecommendationResult[];
  userAdaptationLevel: string;
  totalRatings: number;
  generatedAt: Date;
}

