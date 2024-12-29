import { getWeatherData } from '../controllers/weather-controllers';
import express, { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';

const weatherRouter: Router = express.Router();


weatherRouter.post('/fetch', authMiddleware, getWeatherData);

export default weatherRouter;
