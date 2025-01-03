// authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequestWithUser } from '../types/request.type';
import { MongoService } from '../mongoDb/services/mongoService';
import { Users } from '../mongoDb/models/users';
import { TokenPayload } from '../types/auth.response';

const SECRET_KEY = process.env.JWT_SECRET as string;


export const authMiddleware = (
  req: CustomRequestWithUser,  // Request now includes the 'user' property
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
    req.user = { id: decoded.id, username: decoded.username, name: decoded.name };
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};


export const checkUser = async (
  req: CustomRequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  try {
    const user = await MongoService.findOne(Users, { _id: req.user.id });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    next();
  } catch (error:any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};