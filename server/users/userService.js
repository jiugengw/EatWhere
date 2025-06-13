import User from './userModel.js';
import preferenceMap from '../utils/constants/preferenceScale.js';

export const modifyPreferences = async (user, newPrefs) => {
  newPrefs.forEach((newPref) => {
    const points = preferenceMap[newPref.label];
    const cuisine = newPref.cuisine;
    const oldPref = user.preferences.find(
      (pref) => pref.cuisine === newPref.cuisine
    );
    if (oldPref) {
      oldPref.points = points;
    } else {
      user.preferences.push({ cuisine, points });
    }
  });

  await user.save();

  return user.preferences;
};

export const fetchUserByUsername = async (username) => {
  return await User.findOne({ username }).select('fullName');
};
