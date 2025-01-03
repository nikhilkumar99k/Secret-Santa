import express, { Application } from 'express';
import cors from 'cors';
import apiRoutes from './routers/base';

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// CORS Configuration - Allow all origins
const corsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Route handling
app.use('/api', apiRoutes);

export default app;
