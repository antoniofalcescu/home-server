// TODO: think on what data is needed to arrive here so that it can transfer the file
import { MediaHandlerFactory } from './handler';

export class MediaService {
  private readonly mediaHandlerFactory: MediaHandlerFactory;

  constructor() {
    this.mediaHandlerFactory = new MediaHandlerFactory();
  }

  public async transferMedia(type: string): Promise<void> {
    // TODO: handle type's type either by req validation or here with throw
    const mediaHandler = this.mediaHandlerFactory.getHandler(type);
    await mediaHandler.transferMedia();
  }
}
