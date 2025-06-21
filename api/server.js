import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import gameRoutes from './routes/game.js';

// Middleware imports
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';
import { cloudinaryConfig } from './config/cloudinary.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configure Cloudinary
cloudinaryConfig();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Production Vercel URLs
  'https://bubble-game-sage-seven.vercel.app',
  'https://bubble-game-ppwp.vercel.app',
  // Allow all Vercel preview deployments
  /^https:\/\/bubble-game-.*\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/
];

console.log('CORS Configuration:', {
  clientUrl: process.env.CLIENT_URL,
  nodeEnv: process.env.NODE_ENV,
  allowedOrigins: allowedOrigins.filter(origin => typeof origin === 'string')
});

app.use(cors({
  origin: function (origin, callback) {
    console.log(`CORS request from origin: ${origin}`);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if the origin is in the allowed list or matches the regex pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        const matches = allowedOrigin.test(origin);
        console.log(`Testing regex ${allowedOrigin} against ${origin}: ${matches}`);
        return matches;
      }
      const matches = allowedOrigin === origin;
      console.log(`Testing string ${allowedOrigin} against ${origin}: ${matches}`);
      return matches;
    });
    
    if (isAllowed) {
      console.log(`CORS allowing origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      console.warn('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Explicitly handle preflight OPTIONS requests
app.options('*', (req, res) => {
  console.log(`OPTIONS request from origin: ${req.headers.origin}`);
  res.status(200).end();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bubble Game API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/game', gameRoutes);

// Catch 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
