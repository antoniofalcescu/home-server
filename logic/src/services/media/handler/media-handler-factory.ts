import { MEDIA_HANDLER_TYPE } from './constants';
import { InvalidMediaHandlerTypeError } from './errors';
import { JellyfinMediaHandler } from './instances/jellyfin';
import { MediaHandler } from './interfaces';
import { MediaHandlerDependencies, MediaHandlerType } from './types';

export class MediaHandlerFactory {
  private readonly dependencies: MediaHandlerDependencies;

  private readonly handlers: Record<MediaHandlerType, new (dependencies: MediaHandlerDependencies) => MediaHandler>;

  constructor(dependencies: MediaHandlerDependencies) {
    this.dependencies = dependencies;
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
    return new HandlerClass(this.dependencies);
  }

  private _isMediaHandlerType(type: string): type is MediaHandlerType {
    // TODO: think if there's any better way without type cast
    return Object.values(MEDIA_HANDLER_TYPE).includes(type as MediaHandlerType);
  }
}
