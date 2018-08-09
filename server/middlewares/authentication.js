import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET;


const verifyToken = (req, res, next) => {
  const token = req.headers.auth || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(400).send({ error: 'Session has expired, please log in to my-diary' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({ error: 'Login First' });
  }
};

export default verifyToken;
