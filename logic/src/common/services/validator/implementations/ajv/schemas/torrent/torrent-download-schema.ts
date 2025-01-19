const TORRENT_DOWNLOAD_BODY_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[a-zA-Z0-9_-]+$' },
  },
  required: ['id'],
  additionalProperties: false,
};

export const TORRENT_DOWNLOAD_SCHEMA = {
  type: 'object',
  properties: {
    body: TORRENT_DOWNLOAD_BODY_SCHEMA,
  },
} as const;
