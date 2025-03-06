import { Request, Response } from 'express';
import { HTTP_RESPONSE } from '../../common/constants';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { MediaService } from './media-service';

export class MediaController {
  public async onDownloadFinished(req: Request, res: Response): Promise<void> {
    const mediaService = Container.get<MediaService>(SERVICE_NAME.MEDIA);

    try {
      const { name, type } = req.body;

      await mediaService.onDownloadFinished(name, type);

      res.status(HTTP_RESPONSE.OK.CODE).json({ message: HTTP_RESPONSE.OK.MESSAGE });
    } catch {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }
}
