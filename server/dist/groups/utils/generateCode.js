export const generateCode = (length = 8) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    let index;
    for (let i = 0; i < length; i++) {
        index = Math.floor(Math.random() * characters.length);
        code += characters[index];
    }
    return code;
};
