export const generateCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const rand = Math.floor(Math.random() * chars.length);
        result += chars[rand];
    }
    return result;
};
