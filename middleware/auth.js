import { Request, Response, NextFunction } from 'express';
import { getUserFromXToken, getUserFromAuthorization } from '../utils/auth';

/**
 * applies basic authentication to a route
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserFromAuthorization(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
};

/**
 * applies token authentication to a route
 */

export const tokenAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserFromXToken(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
};