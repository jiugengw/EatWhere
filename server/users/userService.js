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


