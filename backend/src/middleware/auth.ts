
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string };
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header
  // FIX: Use req.headers to access the token as the req.header() method was not found on the AuthRequest type. This also safely handles cases where the header might be an array.
  const tokenHeader = req.headers['x-auth-token'];
  const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { user: { id: string } };
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
