import express from 'express';
import { TorrentController } from '../../torrent';

const torrentRouter = express.Router();

const torrentController = new TorrentController();

torrentRouter.post('/api/v1/torrent/download', torrentController.download);

export { torrentRouter };
