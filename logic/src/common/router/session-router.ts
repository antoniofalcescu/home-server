import express from 'express';
import { SessionController } from '../../services/session';

const sessionRouter = express.Router();

const sessionController = new SessionController();

sessionRouter.get('/api/v1/session', sessionController.getSession);

export { sessionRouter };
