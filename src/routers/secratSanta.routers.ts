import express, { Router } from 'express';
import { authMiddleware, checkUser } from '../middlewares/auth';
import { addInGroups, createSecretSantaGroup, getAllGroups, getMember, getMyMatch, getOneGroup, makeMatches, makeMatchesVisible } from '../controllers/secretSanta.controllers';

const secterSantaRouter: Router = express.Router();


secterSantaRouter.post('/create-group', authMiddleware, checkUser, createSecretSantaGroup);
secterSantaRouter.get('/get-all-groups', authMiddleware, checkUser, getAllGroups);
secterSantaRouter.post('/add-in-group', authMiddleware, checkUser, addInGroups);
secterSantaRouter.post('/make-matches', authMiddleware, checkUser, makeMatches);
secterSantaRouter.post('/make-matches-visible', authMiddleware, checkUser,  makeMatchesVisible);
secterSantaRouter.post('/get-one-group', authMiddleware, checkUser, getOneGroup);
secterSantaRouter.post('/get-my-match', authMiddleware, checkUser, getMyMatch);
secterSantaRouter.post('/get-member', authMiddleware, checkUser, getMember);


export default secterSantaRouter;
