import { Request, Response } from 'express';
import { HTTP_RESPONSE } from '../common/constants';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { TransmissionDaemonDownError, UnrecognizedTorrentError } from './downloaders/transmission-remote/errors';
import { TorrentNotFoundError } from './errors';
import { TorrentService } from './torrent-service';
import {
  TorrentDownloadRequest,
  TorrentGetStatusByIndexRequest,
  TorrentPauseRequest,
  TorrentRemoveRequest,
  TorrentResumeRequest,
  TorrentSearchRequest,
} from './types';

export class TorrentController {
  public async search(req: Request, res: Response): Promise<void> {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        context,
        body: { name, searchLimit },
      } = req as TorrentSearchRequest;

      const torrents = await torrentService.search(context, name, searchLimit);

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
        body: { id },
      } = req as TorrentDownloadRequest;

      await torrentService.download(context, id);

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

  public getStatus(_: Request, res: Response): void {
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

  public getStatusByIndex(req: Request, res: Response): void {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
      } = req as TorrentGetStatusByIndexRequest;

      const torrent = torrentService.getStatusByIndex(torrentIndex);

      if (!torrent) {
        res.status(HTTP_RESPONSE.NOT_FOUND.CODE).json({ message: HTTP_RESPONSE.NOT_FOUND.MESSAGE });
      } else {
        res.status(HTTP_RESPONSE.OK.CODE).json({
          message: HTTP_RESPONSE.OK.MESSAGE,
          torrent,
        });
      }
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public resume(req: Request, res: Response): void {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
      } = req as TorrentResumeRequest;

      torrentService.resume(torrentIndex);

      res.status(HTTP_RESPONSE.ACCEPTED.CODE).json({ message: HTTP_RESPONSE.ACCEPTED.MESSAGE });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public pause(req: Request, res: Response): void {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
      } = req as TorrentPauseRequest;

      torrentService.pause(torrentIndex);

      res.status(HTTP_RESPONSE.ACCEPTED.CODE).json({ message: HTTP_RESPONSE.ACCEPTED.MESSAGE });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }

  public remove(req: Request, res: Response): void {
    const torrentService = Container.get<TorrentService>(SERVICE_NAME.TORRENT);

    try {
      const {
        params: { torrentIndex },
        body: { shouldDelete },
      } = req as TorrentRemoveRequest;

      torrentService.remove(torrentIndex, shouldDelete);

      res.status(HTTP_RESPONSE.ACCEPTED.CODE).json({ message: HTTP_RESPONSE.ACCEPTED.MESSAGE });
    } catch (error) {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }
}
