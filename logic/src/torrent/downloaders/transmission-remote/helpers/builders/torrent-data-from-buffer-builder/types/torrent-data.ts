export type TorrentData = {
  id: number;
  name: string;
  location: string;
  status: TorrentStatus;
  peers: TorrentPeers;
  history: TorrentHistory;
};

export type TorrentStatus = {
  state: string;
  percent: number;
  downloaded: string;
  totalSize: string;
  downloadSpeed: string;
  uploadSpeed: string;
  downloadingTime: number;
  eta: number;
};

export type TorrentPeers = {
  connectedTo: number;
  uploadingTo: number;
  downloadingFrom: number;
};

export type TorrentHistory = {
  added: number;
  started: number;
  latestActivity: number;
};
