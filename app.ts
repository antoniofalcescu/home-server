import express from 'express';
import { EnvHelper } from './logic/src/common/helpers';
import { authenticationRouter, mediaRouter, torrentRouter } from './logic/src/common/router';
import { Container } from './logic/src/injectable';
import { TorrentSessionManager } from './logic/src/jobs/torrent-session-manager';

const app = express();
const port = 3000;

app.use(express.json());

app.use(authenticationRouter);
app.use(torrentRouter);
app.use(mediaRouter);

// TODO: TailScale for Jellyfin (can't stream with CF tunnels) and CF Tunnels for home-server site
// TODO: check what media video/audio is supported on iphone/android and how to maybe download/convert existing ones after downloading them once
//  need for the server to have maybe 2 files for each things (one that is best version for laptop/tv/direct play on LAN, other compatible with remote play for phone/laptop from distance)
app.listen(port, async () => {
  EnvHelper.verify();
  await Container.init();
  await TorrentSessionManager.start();
  console.log(`Example app listening on port ${port}`);

  // TODO: investigate how exactly and if SIGINT supports async ops
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    TorrentSessionManager.stop().finally(() => process.exit(0));
  });
});
