import express from 'express';
import { authenticateMiddleware } from '../../services/authentication';
import { MediaController } from '../../services/media';

const mediaRouter = express.Router();

const mediaController = new MediaController();

mediaRouter.post('/api/v1/media/onDownloadFinished', authenticateMiddleware, mediaController.onDownloadFinished);

export { mediaRouter };
