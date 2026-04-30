import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import diagramRoutes from './routes/diagrams.js';
import templateRoutes from './routes/templates.js';

import logger from "./config/logger.js";
import { authLimiter, apiLimiter } from "./config/rateLimiter.js";
import compression from 'compression';

// Critical env check
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "test") {
  logger.error("FATAL ERROR: JWT_SECRET is not defined");
  process.exit(1);
}

// DB connect
if (process.env.NODE_ENV !== "test") {
  connectDB();
} else {
  console.log("Skipping DB connection in test environment");
}

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(compression());
app.set('trust proxy', 1);

// FIX 1: Explicitly disable crossOriginOpenerPolicy in Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, 
    crossOriginOpenerPolicy: false, // <-- Add this
  })
);

// FIX 2: Use a clean array for CORS (much safer for Preflight requests)
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://infrasketch-frontend-nine.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diagrams', diagramRoutes);
app.use('/api/templates', templateRoutes);

// Health route
app.get('/', (req, res) => {
  res.send('InfraSketch API is running...');
});

app.use((req, res, next) => {
  next({
    status: 404,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
} else {
  logger.info("Test mode: skipping server listen");
}