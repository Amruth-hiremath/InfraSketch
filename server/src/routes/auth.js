import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import admin from '../config/firebase.js';
import logger from "../config/logger.js";
import { safeEmail } from '../utils/sanitizeLog.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next({
          status: 400,
          message: errors.array()[0].msg,
        });
      }

      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        logger.warn(`Register attempt with existing email: ${safeEmail(email)}`);
        return next({ status: 400, message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      logger.info(`User registered: ${safeEmail(email)}`);

      res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email },
        token: generateToken(user._id),
      });
    } catch (error) {
      logger.error(`Register error: ${error.message}`);
      next(error);
    }
  }
);

// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next({
          status: 400,
          message: errors.array()[0].msg,
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        logger.info(`User logged in: ${safeEmail(email)}`);
        res.json({
          user: { _id: user._id, name: user.name, email: user.email },
          token: generateToken(user._id),
        });
      } else {
        logger.warn(`Invalid login attempt: ${safeEmail(email)}`);
        return next({ status: 401, message: 'Invalid email or password' });
      }
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      next(error);
    }
  }
);

// @route   POST /api/auth/firebase
// @access  Public
router.post('/firebase', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next({ status: 400, message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    const { email, uid } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: email.split('@')[0],
        email,
        firebaseUid: uid,
      });
    }

    const jwtToken = generateToken(user._id);
    logger.info(`Firebase login: ${safeEmail(email)}`);

    res.json({
      token: jwtToken,
      user,
    });

  } catch (error) {
    logger.error("Firebase auth failed: " + error.message);

    return next({
      status: 401,
      message: "Invalid Firebase token",
    });
  }
});

// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      logger.warn(`User not found: ${req.user._id}`);
      return next({ status: 404, message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error(`Fetch user error: ${error.message}`);
    next(error);
  }
});

export default router;