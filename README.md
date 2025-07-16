# 🍽️ Smart Restaurant Recommendation System

A personalized restaurant discovery platform that learns from your preferences and provides intelligent recommendations for both individual users and groups.

## 🌟 Key Features

### 🎯 **Personalized Recommendations**
- **Smart Learning Algorithm**: Learns from your ratings to improve future suggestions
- **Adaptive Preferences**: Automatically adjusts recommendations based on your dining history
- **Location-Based Discovery**: Finds restaurants near your current location
- **Cuisine Preference System**: 12 cuisine categories with personalized weightings

### 👥 **Group Recommendations**
- **Multi-User Analysis**: Aggregates preferences from all group members
- **Fair Consensus Algorithm**: Balances different tastes within the group
- **Group Management**: Create, join, and manage dining groups with unique codes
- **Role-Based Access**: Admin and member roles with different permissions

### 🔍 **Smart Discovery**
- **Integrated Search**: Quick restaurant search with real-time results
- **Google Places Integration**: Access to comprehensive restaurant data
- **Intelligent Filtering**: Automatic cuisine detection and relevance scoring
- **Rating Predictions**: AI-powered predictions of how much you'll like each restaurant

### 📊 **Learning System**
- **Weight Adaptation**: Your cuisine preferences automatically adjust based on ratings
- **Feedback Loop**: Each rating improves future recommendations
- **Personal vs Group Context**: Separate learning for individual and group dining

## 🧠 Recommendation Algorithm

### Personal Recommendations

The system uses a **hybrid recommendation approach** combining collaborative and content-based filtering:

```
Final Score = (Google Rating × 0.3) + (Personal Cuisine Score × 0.7)

Where:
Personal Cuisine Score = Manual Preference × Learned Weight
```

#### Algorithm Steps:
1. **Extract User Preferences**: Get manual preferences (1-5 scale) for each cuisine
2. **Apply Learned Weights**: Multiply by weights learned from past ratings (0.5-1.5 range)
3. **Combine with External Data**: Blend with Google ratings and reviews
4. **Rank and Filter**: Sort by combined score and return top recommendations

#### Weight Learning:
```typescript
// After each rating submission
prediction_error = actual_rating - predicted_rating

if (error > 1.0) weight += 0.15      // They loved it more than expected
else if (error > 0.5) weight += 0.08  // Slight positive surprise
else if (error < -1.0) weight -= 0.15 // Much worse than expected
else if (error < -0.5) weight -= 0.08 // Slight disappointment

// Weights are bounded between 0.5 and 1.5
```

### Group Recommendations

Group recommendations use **preference aggregation** without complex social dynamics:

```
Group Score = Average(All Members' (Preference × Weight))
Final Score = (Google Rating × 0.3) + (Group Score × 0.7)
```

#### Benefits of This Approach:
- **Simplicity**: Easy to understand and maintain
- **Fairness**: All group members have equal influence
- **Scalability**: Works with groups of any size
- **Transparency**: Clear reasoning for each recommendation

## 🛠️ Technical Architecture

### Backend (Node.js + Express)
- **Authentication**: JWT-based with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **External APIs**: Google Places API for restaurant data
- **Location Services**: Geolocation-based restaurant discovery

### Frontend (React + TypeScript)
- **State Management**: TanStack Query for server state
- **UI Framework**: Mantine components library
- **Routing**: TanStack Router with type safety
- **Real-time Updates**: Query invalidation for instant UI updates

### Key Data Models

#### User Model
```typescript
{
  username: string,
  email: string,
  preferences: Map<Cuisine, number>,     // Manual 1-5 ratings
  cuisineWeights: Map<Cuisine, number>,  // Learned 0.5-1.5 multipliers
  groups: ObjectId[],
  location: { lat: number, lng: number }
}
```

#### Restaurant Rating
```typescript
{
  user: ObjectId,
  restaurantId: string,
  cuisine: string,
  rating: number,           // User's 1-5 rating
  googleRating: number,     // Restaurant's Google rating
  location: coordinates,
  createdAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Google Places API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd restaurant-recommendation-system
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Environment Setup**

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-recommendations
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start the application**
```bash
# Backend (from server directory)
npm run dev

# Frontend (from client directory)
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🎮 How to Use

### For Individual Users
1. **Set Preferences**: Rate your preference for different cuisines (1-5 scale)
2. **Get Recommendations**: Use the Discover page to find restaurants
3. **Rate Restaurants**: After dining, rate restaurants to improve future suggestions
4. **Search**: Use the integrated search to find specific restaurants

### For Groups
1. **Create Group**: Create a group and get a unique 6-character code
2. **Invite Members**: Share the code with friends to join
3. **Group Recommendations**: Get recommendations that balance everyone's preferences
4. **Manage Group**: Admins can promote members and manage the group

## 📈 Algorithm Performance

### Learning Efficiency
- **Cold Start**: New users get recommendations based on cuisine preferences
- **Warm-up Period**: After 5-10 ratings, personalization becomes effective
- **Mature State**: 20+ ratings provide highly accurate predictions

### Group Dynamics
- **Small Groups (2-4)**: Excellent consensus and satisfaction
- **Medium Groups (5-8)**: Good balance with minor compromises
- **Large Groups (9+)**: May tend toward mainstream choices

## 🔄 Continuous Learning

The system implements a **feedback loop** where:
1. User receives recommendations
2. User tries restaurants and provides ratings
3. System calculates prediction accuracy
4. Weights are adjusted to improve future predictions
5. Better recommendations are generated

This creates a **virtuous cycle** where the system becomes more accurate over time for each individual user.

## 🚧 Future Enhancements

### Planned Features
- **Dietary Restrictions**: Filter by vegetarian, vegan, halal, etc.
- **Price Range Preferences**: Budget-based filtering
- **Time-Based Recommendations**: Different suggestions for breakfast/lunch/dinner
- **Social Features**: Follow friends and see their favorite restaurants
- **Advanced Group Features**: Voting systems and compromise tracking

### Algorithm Improvements
- **Collaborative Filtering**: Learn from similar users' preferences
- **Seasonal Adjustments**: Factor in weather and seasonal preferences
- **Context Awareness**: Consider time of day, occasion, and mood
- **Multi-Armed Bandit**: Balance exploration vs exploitation in recommendations

## 📊 Data Privacy

- **User Consent**: All data collection is explicit and consensual
- **Data Minimization**: Only necessary data is collected and stored
- **Location Privacy**: Precise locations are not stored permanently
- **Group Privacy**: Group data is only accessible to members

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style conventions
- Testing requirements
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for food lovers who want smarter restaurant recommendations**