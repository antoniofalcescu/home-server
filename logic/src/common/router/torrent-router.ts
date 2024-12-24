import express from 'express';
import { contextMiddleware } from '../../context/context-middleware';
import { TorrentController } from '../../torrent';

const torrentRouter = express.Router();

const torrentController = new TorrentController();

torrentRouter.use(contextMiddleware);

torrentRouter.post('/api/v1/torrent/search', torrentController.search);
torrentRouter.post('/api/v1/torrent/download', torrentController.download);
torrentRouter.get('/api/v1/torrent/status', torrentController.getStatus);
torrentRouter.post('/api/v1/torrent/resume', torrentController.resume);
torrentRouter.post('/api/v1/torrent/pause', torrentController.pause);
torrentRouter.post('/api/v1/torrent/remove', torrentController.remove);

export { torrentRouter };
