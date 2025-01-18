import { TORRENT_PATH_PARAMS_SCHEMA } from './shared';

export const TORRENT_GET_STATUS_BY_INDEX_SCHEMA = {
  type: 'object',
  properties: {
    params: TORRENT_PATH_PARAMS_SCHEMA,
  },
} as const;
