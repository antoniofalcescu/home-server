import express from 'express';
import { AuthenticationController } from '../../services/authentication';

const authenticationRouter = express.Router();

const authenticationController = new AuthenticationController();

authenticationRouter.post('/api/v1/authentication/login', authenticationController.login);

export { authenticationRouter };
