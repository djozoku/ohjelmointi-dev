import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import admin from 'firebase-admin';
import { IncomingMessage, ServerResponse } from 'http';
import next from 'next';
import { schema } from '../shared/schema';

export async function createServer(
  req: express.Request | IncomingMessage,
  res: express.Response | ServerResponse,
  firebase: admin.app.App,
) {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev, conf: { distDir: 'next' } });
  const handle = app.getRequestHandler();
  await app.prepare();
  const server = express();
  // TODO: inject firebase admin to next.js
  const apolloServer = new ApolloServer({ schema });
  apolloServer.applyMiddleware({ app: server });
  server.get('*', (request, response) => {
    handle(request, response).catch((err) => {
      throw err;
    });
  });
  server(req, res);
}
