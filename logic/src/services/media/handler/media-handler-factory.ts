import { JellyfinMediaHandler } from './instances/jellyfin';
import { MediaHandler } from './interfaces';
import { MediaHandlerType } from './types';

export class MediaHandlerFactory {
  private static handlers: Record<MediaHandlerType, MediaHandler> = {
    movie: new JellyfinMediaHandler(),
    tvShow: new JellyfinMediaHandler(),
  };

  static getHandler(type: MediaHandlerType): MediaHandler {
    if (!this.handlers[type]) throw new Error(`Handler not found for ${type}`);
    return this.handlers[type];
  }
}
