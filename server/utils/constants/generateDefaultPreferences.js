const defaultCuisines = [
  'Chinese',
  'Korean',
  'Japanese',
  'Italian',
  'Mexican',
  'Indian',
  'Thai',
  'French',
  'Muslim',
  'Vietnamese',
  'Western',
  'Fast Food',
];

const generateDefaultPreferences = () => {
  return defaultCuisines.map((cuisine) => ({
    cuisine,
    points: 0,
  }));
};

export default generateDefaultPreferences;
