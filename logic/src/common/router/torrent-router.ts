import express from 'express';
import { contextMiddleware } from '../../context/context-middleware';
import { TorrentController } from '../../torrent';

const torrentRouter = express.Router();

const torrentController = new TorrentController();

torrentRouter.post('/api/v1/torrent/search', contextMiddleware, torrentController.search);
torrentRouter.post('/api/v1/torrent/download', contextMiddleware, torrentController.download);
torrentRouter.get('/api/v1/torrent/status', torrentController.getStatus);
torrentRouter.get('/api/v1/torrent/status/:id', torrentController.getStatusById);
torrentRouter.post('/api/v1/torrent/resume', torrentController.resume);
torrentRouter.post('/api/v1/torrent/pause', torrentController.pause);
torrentRouter.post('/api/v1/torrent/remove', torrentController.remove);

export { torrentRouter };
