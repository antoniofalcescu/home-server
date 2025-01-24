import { Request } from 'express';
import { RequestWithContext } from '../../../common/types';

type TorrentControllerPathParams = {
  torrentIndex: number;
};

export type TorrentSearchRequest = RequestWithContext & {
  body: { name: string; searchLimit: number };
};

export type TorrentDownloadRequest = RequestWithContext & {
  body: { id: string };
};

export type TorrentGetStatusByIndexRequest = Request & {
  params: TorrentControllerPathParams;
};

export type TorrentResumeRequest = Request & {
  params: TorrentControllerPathParams;
};

export type TorrentPauseRequest = Request & {
  params: TorrentControllerPathParams;
};

export type TorrentRemoveRequest = Request & {
  params: TorrentControllerPathParams;
  body: { shouldDelete: boolean };
};
