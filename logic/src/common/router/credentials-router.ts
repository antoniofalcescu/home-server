import express, { Request, Response } from 'express';
import { CredentialsController } from '../../credentials';

const credentialsRouter = express.Router();

const credentialsController = new CredentialsController();
credentialsRouter.get('/api/v1/credentials', (req: Request, res: Response) =>
  credentialsController.getCredentials(req, res)
);

export { credentialsRouter };
