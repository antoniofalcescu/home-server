import { TORRENT_PATH_PARAMS_SCHEMA } from './shared';

export const TORRENT_RESUME_SCHEMA = {
  type: 'object',
  properties: {
    params: TORRENT_PATH_PARAMS_SCHEMA,
  },
} as const;
