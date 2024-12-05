import { Request, Response } from 'express';
import { CredentialsService } from './credentials-service';

export class CredentialsController {
  private readonly credentialsService: CredentialsService;

  constructor() {
    this.credentialsService = new CredentialsService();
  }

  public async getCredentials(_: Request, res: Response): Promise<void> {
    try {
      const cookies = await this.credentialsService.getCredentials();
      console.log(cookies);
      res.sendStatus(200);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
