import { LoggerService } from '../../../../common/services/logger';
import { MEDIA_HANDLER_TYPE } from '../constants';

export type MediaHandlerType = (typeof MEDIA_HANDLER_TYPE)[keyof typeof MEDIA_HANDLER_TYPE];

export type Media = {
  name: string;
  type: MediaHandlerType;
};

export type MediaHandlerDependencies = {
  loggerService: LoggerService;
};
