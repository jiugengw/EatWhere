import APIFeatures from './../utils/APIFeatures.js';
import Group from './../models/groupModel.js';

export const fetchGroupsByUser = async (id, options = {}) => {
  const filter = { users: id };

  const features = new APIFeatures(Group.find(filter), options)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

export const fetchGroupByCode = async (code) => {
  return await Group.findOne({ code }).select('name users').populate({
    path: 'users',
    select: 'fullName username',
  });
};
