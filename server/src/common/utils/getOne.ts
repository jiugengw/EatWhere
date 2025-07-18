import { catchAsync } from './catchAsync.js';
import { StatusCodes } from 'http-status-codes';
import type { Model, PopulateOptions } from 'mongoose';
import type { RequestHandler } from 'express';
import { AppError } from './AppError.js';

type GetOneOptions = {
  populateOptions?: PopulateOptions | (string | PopulateOptions)[];
  selectFields?: string;
  enableVirtuals?: boolean;
};

export const getOne = <T>(
  Model: Model<T>,
  options?: GetOneOptions
): RequestHandler => {
  const {
    populateOptions,
    selectFields,
    enableVirtuals = true,
  } = options || {};
  return catchAsync(async (req, res, next) => {

    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);
    if (selectFields) query = query.select(selectFields);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND)
      );
    }

    let output = doc.toJSON({ virtuals: enableVirtuals });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { [Model.modelName.toLowerCase()]: output },
    });
  });
};

