import express from 'express';
import { AuthenticationController } from '../../services/authentication';
import { validatorMiddleware } from '../services/validator';
import { LOGIN_SCHEMA } from '../services/validator/implementations/ajv/schemas';

const authenticationRouter = express.Router();

const authenticationController = new AuthenticationController();

authenticationRouter.post(
  '/api/v1/authentication/login',
  validatorMiddleware(LOGIN_SCHEMA),
  authenticationController.login
);

export { authenticationRouter };
