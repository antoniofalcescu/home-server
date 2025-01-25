import express from 'express';
import { EnvHelper } from './logic/src/common/helpers';
import { sessionRouter, torrentRouter } from './logic/src/common/router';
import { Container } from './logic/src/injectable';
import { TorrentSessionManager } from './logic/src/jobs/torrent-session-manager';

const app = express();
const port = 3000;

app.use(express.json());

app.use(sessionRouter);
app.use(torrentRouter);

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
