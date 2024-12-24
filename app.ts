import express from 'express';
import { credentialsRouter, torrentRouter } from './logic/src/common/router';
import { Container } from './logic/src/injectable';

const app = express();
const port = 3000;

app.use(express.json());

app.use(credentialsRouter);
app.use(torrentRouter);

app.listen(port, async () => {
  await Container.init();
  console.log(`Example app listening on port ${port}`);
});
