export type ParsedBuffer = { [key in ParsedBufferKeys]: string };

type ParsedBufferKeys =
  | 'id'
  | 'name'
  | 'hash'
  | 'magnet'
  | 'labels'
  | 'state'
  | 'location'
  | 'percentDone'
  | 'eta'
  | 'downloadSpeed'
  | 'uploadSpeed'
  | 'have'
  | 'totalSize'
  | 'downloaded'
  | 'uploaded'
  | 'ratio'
  | 'peers'
  | 'dateAdded'
  | 'dateStarted'
  | 'latestActivity'
  | 'downloadingTime'
  | 'dateCreated'
  | 'publicTorrent'
  | 'comment'
  | 'creator'
  | 'source'
  | 'pieceCount'
  | 'pieceSize'
  | 'downloadLimit'
  | 'uploadLimit'
  | 'ratioLimit'
  | 'honorsSessionLimits'
  | 'peerLimit'
  | 'bandwidthProperty';
