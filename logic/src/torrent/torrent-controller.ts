import { Request, Response } from 'express';
import { TorrentService } from './torrent-service';

export class TorrentController {
  private readonly torrentService: TorrentService;

  constructor() {
    this.torrentService = new TorrentService();
  }

  public async download(_: Request, res: Response): Promise<void> {
    try {
      const downloadRes = await this.torrentService.download();
      res.status(200).json(downloadRes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
