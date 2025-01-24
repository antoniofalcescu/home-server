import express from 'express';
import { CredentialsController } from '../../services/credentials';

const credentialsRouter = express.Router();

const credentialsController = new CredentialsController();

credentialsRouter.get('/api/v1/credentials', credentialsController.getCredentials);

export { credentialsRouter };
