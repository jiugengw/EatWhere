import { catchAsync } from './catchAsync.js';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError.js';
export const getOne = (Model, options) => {
    const { populateOptions, selectFields, findByFn, enableVirtuals = true, } = options || {};
    return catchAsync(async (req, res, next) => {
        let query;
        if (findByFn) {
            const filter = findByFn(req);
            query = Model.findOne(filter);
        }
        else {
            query = Model.findById(req.params.id);
        }
        if (populateOptions)
            query = query.populate(populateOptions);
        if (selectFields)
            query = query.select(selectFields);
        const doc = await query;
        if (!doc) {
            return next(new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND));
        }
        let output = doc.toJSON({ virtuals: enableVirtuals });
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
        const { postDeleteFn } = options || {};
        const doc = await Model.findByIdAndUpdate(req.params.id, { active: false }, { new: true, runValidators: true });
        if (!doc) {
            return next(new AppError(`No ${Model.modelName} found`, StatusCodes.NOT_FOUND));
        }
        if (typeof postDeleteFn === 'function') {
            await postDeleteFn(doc);
        }
        res.status(StatusCodes.NO_CONTENT).end();
    });
};
