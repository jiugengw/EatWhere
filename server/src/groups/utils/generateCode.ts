export const generateCode = (length: number = 8): string => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  let index: number;

  for (let i = 0; i < length; i++) {
    index = Math.floor(Math.random() * characters.length);
    code += characters[index];
  }

  return code;
};
