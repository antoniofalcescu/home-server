import { Media } from '../types';

export interface MediaHandler {
  onDownloadFinished(media: Media): Promise<void>;
}
