import express from 'express';
import { authenticateToken } from '../../services/authentication';
import { TorrentController } from '../../services/torrent';
import { contextMiddleware } from '../services/context';
import { validatorMiddleware } from '../services/validator';
import {
  TORRENT_DOWNLOAD_SCHEMA,
  TORRENT_GET_STATUS_BY_INDEX_SCHEMA,
  TORRENT_PAUSE_SCHEMA,
  TORRENT_REMOVE_SCHEMA,
  TORRENT_RESUME_SCHEMA,
  TORRENT_SEARCH_SCHEMA,
} from '../services/validator/implementations/ajv/schemas';

const torrentRouter = express.Router();

const torrentController = new TorrentController();

// TODO: IMPLEMENT VALIDATION FOR AUTHENTICATION AND ALSO CHECK IF BEARER IS PASSED
torrentRouter.post(
  '/api/v1/torrent/search',
  validatorMiddleware(TORRENT_SEARCH_SCHEMA),
  authenticateToken,
  contextMiddleware,
  torrentController.search
);
torrentRouter.post(
  '/api/v1/torrent/download',
  validatorMiddleware(TORRENT_DOWNLOAD_SCHEMA),
  contextMiddleware,
  torrentController.download
);
torrentRouter.get('/api/v1/torrent/status', torrentController.getStatus);
torrentRouter.get(
  '/api/v1/torrent/status/:torrentIndex',
  validatorMiddleware(TORRENT_GET_STATUS_BY_INDEX_SCHEMA),
  torrentController.getStatusByIndex
);
torrentRouter.post(
  '/api/v1/torrent/resume/:torrentIndex',
  validatorMiddleware(TORRENT_RESUME_SCHEMA),
  torrentController.resume
);
torrentRouter.post(
  '/api/v1/torrent/pause/:torrentIndex',
  validatorMiddleware(TORRENT_PAUSE_SCHEMA),
  torrentController.pause
);
torrentRouter.delete(
  '/api/v1/torrent/remove/:torrentIndex',
  validatorMiddleware(TORRENT_REMOVE_SCHEMA),
  torrentController.remove
);

export { torrentRouter };
