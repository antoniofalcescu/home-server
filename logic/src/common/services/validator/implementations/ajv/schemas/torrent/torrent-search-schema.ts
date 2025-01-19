const TORRENT_SEARCH_BODY_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', pattern: '^[a-zA-Z0-9._\\- ]+$' },
    searchLimit: { type: 'integer', minimum: 1, maximum: 10 },
  },
  required: ['name', 'searchLimit'],
  additionalProperties: false,
};

export const TORRENT_SEARCH_SCHEMA = {
  type: 'object',
  properties: {
    body: TORRENT_SEARCH_BODY_SCHEMA,
  },
} as const;
