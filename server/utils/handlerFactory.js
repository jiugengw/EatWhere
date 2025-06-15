import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import APIFeatures from './APIFeatures.js';
import { StatusCodes } from 'http-status-codes';

export const createOne = (Model, dataKey = 'data') => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        [dataKey]: doc,
      },
    });
  });
};

export const getOne = ({
  Model,
  populateOptions = null,
  selectFields = null,
  findByFn = null,
  disableVirtuals = true,
  dataKey = 'data',
}) => {
  return catchAsync(async (req, res, next) => {
    let query;
    if (findByFn) {
      const filter = findByFn(req);
      query = Model.findOne(filter);
    } else {
      query = Model.findById(req.params.id);
    }
    if (populateOptions) query = query.populate(populateOptions);
    if (selectFields) query = query.select(selectFields);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      );
    }

    const output = doc.toJSON({ virtuals: !disableVirtuals });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [dataKey]: output,
      },
    });
  });
};

export const getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // to allow for nested GET
    let filter = {};
    if (req.params.userid) filter.user = req.params.userid;
    if (req.params.groupid) filter.group = req.params.groupid;

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(StatusCodes.OK).json({
      status: 'success',
      results: doc.length,
      data: {
        [dataKey]: doc,
      },
    });
  });
};

export const updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError('No document found with that ID', StatusCodes.NOT_FOUND)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [dataKey]: doc,
      },
    });
  });
};

export const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return new AppError(
        'No document found with that ID',
        StatusCodes.NOT_FOUND
      );
    }

    res.status(StatusCodes.NO_CONTENT).end();
  });
};
