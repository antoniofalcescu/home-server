// TODO: think on what data is needed to arrive here so that it can transfer the file
import { LoggerService } from '../../common/services/logger';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { MediaHandlerFactory } from './handler';

export class MediaService {
  private readonly loggerService: LoggerService;

  private readonly mediaHandlerFactory: MediaHandlerFactory;

  constructor() {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);

    this.mediaHandlerFactory = new MediaHandlerFactory();
  }

  public async afterDownload(type: string): Promise<void> {
    const mediaHandler = this.mediaHandlerFactory.getHandler(type);
    await mediaHandler.afterDownload();
  }
}
