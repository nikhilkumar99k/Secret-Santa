import express, { Router } from 'express';
import { loginController, signupController } from '../controllers/auth.controllers';

const authRouter: Router = express.Router();


authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);

export default authRouter;
