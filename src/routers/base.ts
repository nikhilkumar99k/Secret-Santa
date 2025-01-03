// api-route.ts
import express, { Router } from 'express';
import authRouter from './auth.routers';
import secterSantaRouter from './secratSanta.routers';

const apiRouter: Router = express.Router();

// Use the sub-routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/secret-santa', secterSantaRouter);

export default apiRouter;
