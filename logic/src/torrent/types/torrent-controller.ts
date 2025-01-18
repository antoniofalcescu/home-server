type TorrentControllerPathParams = {
  torrentIndex: number;
};

export type TorrentGetStatusByIndexRequest = {
  params: TorrentControllerPathParams;
};

export type TorrentResumeRequest = {
  params: TorrentControllerPathParams;
};

export type TorrentPauseRequest = {
  params: TorrentControllerPathParams;
};

export type TorrentRemoveRequest = {
  params: TorrentControllerPathParams;
  body: { shouldDelete: boolean };
};
