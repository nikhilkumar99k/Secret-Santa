import express, { Application } from 'express';
import apiRoutes from './routers/base';

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Route handling
app.use('/api', apiRoutes);

export default app;
