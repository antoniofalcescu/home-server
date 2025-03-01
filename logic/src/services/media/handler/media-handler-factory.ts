import { JellyfinMediaHandler } from './instances/jellyfin';
import { MediaHandler } from './interfaces';
import { MediaHandlerType } from './types';

export class MediaHandlerFactory {
  private readonly handlers: Record<MediaHandlerType, new () => MediaHandler>;

  constructor() {
    this.handlers = {
      movie: JellyfinMediaHandler,
      tvShow: JellyfinMediaHandler,
    };
  }

  getHandler(type: MediaHandlerType): MediaHandler {
    const HandlerClass = this.handlers[type];
    if (!HandlerClass) throw new Error(`Handler not found for ${type}`);
    return new HandlerClass();
  }
}
