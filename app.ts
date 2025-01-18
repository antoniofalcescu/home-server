import express from 'express';
import { EnvHelper } from './logic/src/common/helpers';
import { credentialsRouter, torrentRouter } from './logic/src/common/router';
import { contextMiddleware } from './logic/src/common/services/context';
import { Container } from './logic/src/injectable';

const app = express();
const port = 3000;

app.use(express.json());

app.use(credentialsRouter);

app.use(contextMiddleware);
app.use(torrentRouter);

app.listen(port, async () => {
  EnvHelper.verify();
  await Container.init();
  console.log(`Example app listening on port ${port}`);
});
