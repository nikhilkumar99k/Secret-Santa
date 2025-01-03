// api-route.ts
import express, { Router } from 'express';
import weatherRouter from './weather-routes';
import authRouter from './auth-routers';
import seacterSantaRouter from './seacratSanta.routers';

const apiRouter: Router = express.Router();

// Use the sub-routers
apiRouter.use('/weather', weatherRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/seacret-santa', seacterSantaRouter);

export default apiRouter;
