import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import APIFeatures from './APIFeatures.js';
import getRequiredFields from './getRequiredFields.js';
import { StatusCodes } from 'http-status-codes';

export const getOne = (Model, options) => {
  const {
    populateOptions,
    selectFields,
    findByFn,
    transformFn,
    enableVirtuals = true,
  } = options || {};
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
        new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND)
      );
    }
   
    let output = doc.toJSON({ virtuals: enableVirtuals });

    if (transformFn) output = transformFn(output);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [Model.modelName]: output,
      },
    });
  });
};

export const deleteOne = (Model, options) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(
        new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND)
      );
    }

    if (options.postDeleteFn) {
      await postDeleteFn(doc);
    }

    res.status(StatusCodes.NO_CONTENT).end();
  });
};

export const createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const body = getRequiredFields(Model.schema, req.body);

    if (Model.modelName === 'Group') {
      body.users = [req.user.id];
    } else if (Model.modelName === 'History') {
      body.user = req.user.id;
      if (req.groupid) body.group = req.groupid;
    }

    const doc = await Model.create(body);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        [Model.modelName]: doc,
      },
    });
  });
};

export const updateOne = (Model, options) => {
  return catchAsync(async (req, res, next) => {
    const updateData = options.filteredBodyFn
      ? options.filteredBodyFn(req)
      : req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'No valid fields to update',
        data: {},
      });
    }

    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoc) {
      throw new AppError(`${Model.modelName} not found`, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [Model.modelName]: updatedDoc,
      },
    });
  });
};
