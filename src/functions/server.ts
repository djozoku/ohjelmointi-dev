import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { IncomingMessage, ServerResponse } from 'http';
import * as next from 'next';
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
  const apolloServer = new ApolloServer({ schema });
  apolloServer.applyMiddleware({ app: server });
  server.get('*', (request, response) => {
    handle(request, response).catch((err) => {
      throw err;
    });
  });
  server(req, res);
}
