import { Request, Response } from 'express';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { UnrecognizedTorrentError } from './downloaders/transmission-remote/errors';
import { TransmissionDaemonDownError } from './downloaders/transmission-remote/errors/transmission-daemon-down-error';
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
      const response = await torrentService.search(context, name);
      res.status(200).json(response);
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
      await torrentService.download(context, id);
      res.status(201).json({ message: 'Created' });
    } catch (error) {
      if (error instanceof TransmissionDaemonDownError) {
        res.status(503).json({ message: 'Service Unavailable' });
      } else if (error instanceof UnrecognizedTorrentError) {
        res.status(400).json({ message: 'Bad Request' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }

  public async getStatus(_: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const response = await torrentService.getStatus();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error((error as Error).message);
    }
  }

  // TODO: add validations for input
  public async getStatusById(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { id },
      } = req;

      const response = await torrentService.getStatusById(id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error((error as Error).message);
    }
  }

  public async resume(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        body: { id },
      } = req;
      const response = await torrentService.resume(id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error((error as Error).message);
    }
  }

  public async pause(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        body: { id },
      } = req;
      const response = await torrentService.pause(id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error((error as Error).message);
    }
  }

  public async remove(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        body: { id, shouldDelete },
      } = req;
      const response = await torrentService.remove(id, shouldDelete);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      console.error((error as Error).message);
    }
  }
}
