import { MEDIA_HANDLER_TYPE } from './constants';
import { InvalidMediaHandlerTypeError } from './errors';
import { JellyfinMediaHandler } from './instances/jellyfin';
import { MediaHandler } from './interfaces';
import { MediaHandlerType } from './types';

export class MediaHandlerFactory {
  private readonly handlers: Record<MediaHandlerType, new (type: MediaHandlerType) => MediaHandler>;

  constructor() {
    this.handlers = {
      [MEDIA_HANDLER_TYPE.MOVIE]: JellyfinMediaHandler,
      [MEDIA_HANDLER_TYPE.TV_SHOW]: JellyfinMediaHandler,
    };
  }

  public getHandler(type: string): MediaHandler {
    if (!this._isMediaHandlerType(type)) {
      throw new InvalidMediaHandlerTypeError('Invalid media handler type', { type });
    }

    const HandlerClass = this.handlers[type];
    return new HandlerClass(type);
  }

  private _isMediaHandlerType(type: string): type is MediaHandlerType {
    // TODO: think if there's any better way without type cast
    return Object.values(MEDIA_HANDLER_TYPE).includes(type as MediaHandlerType);
  }
}
