import express from 'express';
import { TorrentController } from '../../torrent';
import { validatorMiddleware } from '../services/validator';
import {
  TORRENT_GET_STATUS_BY_INDEX_SCHEMA,
  TORRENT_PAUSE_SCHEMA,
  TORRENT_REMOVE_SCHEMA,
  TORRENT_RESUME_SCHEMA,
} from '../services/validator/implementations/ajv/schemas';

const torrentRouter = express.Router();

const torrentController = new TorrentController();

torrentRouter.post('/api/v1/torrent/search', torrentController.search);
torrentRouter.post('/api/v1/torrent/download', torrentController.download);
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
