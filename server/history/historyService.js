import APIFeatures from './../utils/APIFeatures.js';
import History from './historyModel.js';

const getHistory = async (key, id, query) => {
  const filter = { [key]: id };

  const features = new APIFeatures(History.find(filter), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const history = await features.query;

  return history;
};

export default getHistory;
