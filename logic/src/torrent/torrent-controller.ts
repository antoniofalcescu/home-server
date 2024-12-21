import { Request, Response } from 'express';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { TorrentNotFoundError } from './errors';
import { TorrentService } from './torrent-service';

export class TorrentController {
  public async search(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        context,
        body: { name },
      } = req;
      const searchResponse = await torrentService.search(context, name);
      res.status(200).json(searchResponse);
    } catch (error) {
      console.error(error);
      if (error instanceof TorrentNotFoundError) {
        res.status(404).json({ message: 'Not found' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  public async download(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        context,
        body: { id },
      } = req;
      const downloadRes = await torrentService.download(context, id);
      res.status(200).json(downloadRes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error((error as Error).message);
    }
  }
}
