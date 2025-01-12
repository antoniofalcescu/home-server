import { Request, Response } from 'express';
import { HTTP_RESPONSE } from '../common/constants';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { TransmissionDaemonDownError, UnrecognizedTorrentError } from './downloaders/transmission-remote/errors';
import { TorrentNotFoundError } from './errors';
import { TorrentService } from './torrent-service';

// TODO: add validations for input (ajv and check if torrents exist)
export class TorrentController {
  public async search(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        context,
        body: { torrentName },
      } = req;

      const torrents = await torrentService.search(context, torrentName);

      res.status(HTTP_RESPONSE.OK.CODE).json({
        message: HTTP_RESPONSE.OK.MESSAGE,
        torrents,
      });
    } catch (error) {
      if (error instanceof TorrentNotFoundError) {
        res.status(HTTP_RESPONSE.NOT_FOUND.CODE).json({ message: HTTP_RESPONSE.NOT_FOUND.MESSAGE });
        return;
      }

      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public async download(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        context,
        body: { torrentId },
      } = req;

      await torrentService.download(context, torrentId);

      res.status(HTTP_RESPONSE.CREATED.CODE).json({ message: HTTP_RESPONSE.CREATED.MESSAGE });
    } catch (error) {
      if (error instanceof TransmissionDaemonDownError) {
        res.status(HTTP_RESPONSE.SERVICE_UNAVAILABLE.CODE).json({ message: HTTP_RESPONSE.SERVICE_UNAVAILABLE.MESSAGE });
        return;
      }

      if (error instanceof UnrecognizedTorrentError) {
        res.status(HTTP_RESPONSE.BAD_REQUEST.CODE).json({ message: HTTP_RESPONSE.BAD_REQUEST.MESSAGE });
        return;
      }

      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public async getStatus(_: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const torrents = torrentService.getStatus();

      res.status(HTTP_RESPONSE.OK.CODE).json({
        message: HTTP_RESPONSE.OK.MESSAGE,
        torrents,
      });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  // TODO: add validations for input
  public async getStatusByIndex(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
      } = req;

      const torrent = torrentService.getStatusByIndex(torrentIndex as unknown as number);

      if (!torrent) {
        res.status(HTTP_RESPONSE.NOT_FOUND.CODE).json({ message: HTTP_RESPONSE.NOT_FOUND.MESSAGE });
        return;
      }

      res.status(HTTP_RESPONSE.OK.CODE).json({
        message: HTTP_RESPONSE.OK.MESSAGE,
        torrent,
      });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public async resume(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
      } = req;

      torrentService.resume(torrentIndex as unknown as number);

      res.status(HTTP_RESPONSE.ACCEPTED.CODE).json({ message: HTTP_RESPONSE.ACCEPTED.MESSAGE });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public async pause(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
      } = req;

      torrentService.pause(torrentIndex as unknown as number);

      res.status(HTTP_RESPONSE.ACCEPTED.CODE).json({ message: HTTP_RESPONSE.ACCEPTED.MESSAGE });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public async remove(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
        body: { shouldDelete },
      } = req;

      torrentService.remove(torrentIndex as unknown as number, shouldDelete);

      res.status(HTTP_RESPONSE.ACCEPTED.CODE).json({ message: HTTP_RESPONSE.ACCEPTED.MESSAGE });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }
}
