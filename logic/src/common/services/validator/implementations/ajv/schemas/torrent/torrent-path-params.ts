import { JSONSchemaType } from 'ajv';

type TorrentPathParams = {
  torrentIndex: number;
};

export const TORRENT_PATH_PARAMS_SCHEMA: JSONSchemaType<TorrentPathParams> = {
  type: 'object',
  properties: {
    torrentIndex: { type: 'integer', minimum: 1 },
  },
  required: ['torrentIndex'],
  additionalProperties: false,
} as const;
