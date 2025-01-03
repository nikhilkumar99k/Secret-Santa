import express, { Router } from 'express';
import { authMiddleware, checkUser } from '../middlewares/auth-middleware';
import { addInGroups, createSecretSantaGroup, getAllGroups, getMyMatch, getOneGroup, makeMatches, makeMatchesVisible } from '../controllers/seacretSanta.controllers';

const seacterSantaRouter: Router = express.Router();


seacterSantaRouter.post('/create-group', authMiddleware, checkUser, createSecretSantaGroup);
seacterSantaRouter.get('/get-all-groups', authMiddleware, checkUser, getAllGroups);
seacterSantaRouter.post('/add-in-group', authMiddleware, checkUser, addInGroups);
seacterSantaRouter.post('/make-matches', authMiddleware, checkUser, makeMatches);
seacterSantaRouter.post('/make-matches-visible', authMiddleware, checkUser,  makeMatchesVisible);
seacterSantaRouter.post('/get-one-group', authMiddleware, checkUser, getOneGroup);
seacterSantaRouter.post('/get-my-match', authMiddleware, checkUser, getMyMatch);


export default seacterSantaRouter;
