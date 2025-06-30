import { catchAsync } from './catchAsync';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';
import { getRequiredFields } from './getRequiredFields';
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
export const createOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const body = getRequiredFields(Model.schema, req.body);
        if (!req.user) {
            return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
        }
        if (Model.modelName === 'Group') {
            body.users = [req.user.id];
        }
        else if (Model.modelName === 'History') {
            body.user = req.user.id;
            if (req.group?.id)
                body.group = req.group.id;
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
