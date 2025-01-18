import { TORRENT_PATH_PARAMS_SCHEMA } from './shared';

const TORRENT_REMOVE_BODY_SCHEMA = {
  type: 'object',
  properties: {
    shouldDelete: { type: 'boolean' },
  },
  required: ['shouldDelete'],
  additionalProperties: false,
} as const;

export const TORRENT_REMOVE_SCHEMA = {
  type: 'object',
  properties: {
    params: TORRENT_PATH_PARAMS_SCHEMA,
    body: TORRENT_REMOVE_BODY_SCHEMA,
  },
} as const;
