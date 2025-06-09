import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer: ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    console.log(decoded)


    next();
  } catch (err) {
    res.status(401).json({ message: 'Access denied' });
  }
};
