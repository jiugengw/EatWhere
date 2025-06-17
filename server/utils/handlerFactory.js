import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import APIFeatures from './APIFeatures.js';
import { StatusCodes } from 'http-status-codes';

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
      return next(new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND));
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

export const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.NO_CONTENT).end();
  });
};
