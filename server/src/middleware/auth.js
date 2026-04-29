import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next({
          status: 401,
          message: 'User not found'
        });
      }

      req.user = user;

      return next();

    } catch (error) {
      console.error('Token verification failed:', error.message);

      return next({
        status: 401,
        message: 'Not authorized, token failed'
      });
    }
  }

  return next({
    status: 401,
    message: 'Not authorized, no token provided'
  });
};