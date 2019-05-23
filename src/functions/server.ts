import { createSchema } from '@ohjelmointi-dev/shared';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import admin from 'firebase-admin';
import { ServerResponse } from 'http';
import next from 'next';

export async function createServer(
  req: express.Request,
  res: express.Response | ServerResponse,
  firebase: admin.app.App,
) {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev, conf: { distDir: 'next' } });
  const handle = app.getRequestHandler();
  await app.prepare();
  const server = express();
  const schema = createSchema(firebase);
  const apolloServer = new ApolloServer({ schema });
  // pass firebase to serverside next.js
  server.use((request, _, nextFunc) => {
    request.query._firebase = firebase;
    nextFunc();
  });
  apolloServer.applyMiddleware({ app: server });
  server.get('*', (request, response) => {
    handle(request, response).catch((err) => {
      throw err;
    });
  });
  server(req, res);
}
