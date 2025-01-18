export const TORRENT_PATH_PARAMS_SCHEMA = {
  type: 'object',
  properties: {
    torrentIndex: { type: 'integer', minimum: 1 },
  },
  required: ['torrentIndex'],
  additionalProperties: false,
} as const;
