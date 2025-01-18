import express from 'express';
import { TorrentController } from '../../torrent';
import { contextMiddleware } from '../services/context';
import { validatorMiddleware } from '../services/validator';
import { TORRENT_PATH_PARAMS_SCHEMA } from '../services/validator/implementations/ajv/schemas';

const torrentRouter = express.Router();

const torrentController = new TorrentController();

torrentRouter.post('/api/v1/torrent/search', contextMiddleware, torrentController.search);
torrentRouter.post('/api/v1/torrent/download', contextMiddleware, torrentController.download);
torrentRouter.get('/api/v1/torrent/status', torrentController.getStatus);
torrentRouter.get(
  '/api/v1/torrent/status/:torrentIndex',
  // TODO: maybe merge these 2 fields into one param
  //  like do a big schema for each endpoint and use that with bigger object: { params: { object}, body: { object} }
  validatorMiddleware(TORRENT_PATH_PARAMS_SCHEMA, 'params'),
  torrentController.getStatusByIndex
);
torrentRouter.post('/api/v1/torrent/resume/:torrentIndex', torrentController.resume);
torrentRouter.post('/api/v1/torrent/pause/:torrentIndex', torrentController.pause);
torrentRouter.post('/api/v1/torrent/remove/:torrentIndex', torrentController.remove);

export { torrentRouter };
