import { getWeatherData } from '../controllers/weather-controllers';
import express, { Router } from 'express';
import { authMiddleware, checkUser } from '../middlewares/auth-middleware';

const weatherRouter: Router = express.Router();


weatherRouter.post('/fetch', authMiddleware, checkUser, getWeatherData);

export default weatherRouter;
