// api-route.ts
import express, { Router } from 'express';
import authRouter from './auth.routers';
import secterSantaRouter from './secratSanta.routers';

const apiRouter: Router = express.Router();

// Use the sub-routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/secret-santa', secterSantaRouter);
apiRouter.get('/', (req, res) => {
    res.send("<div><h1>Secret Santa API</h1></div>");
})

export default apiRouter;
