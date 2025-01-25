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

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await TorrentSessionManager.stop();
    process.exit(0);
  });
});
