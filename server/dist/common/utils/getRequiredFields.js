export const getRequiredFields = (schema, body) => {
    const requiredFields = schema.requiredPaths();
    const formattedBody = {};
    requiredFields.forEach((field) => {
        if (body[field] !== undefined) {
            formattedBody[field] = body[field];
        }
    });
    return formattedBody;
};
