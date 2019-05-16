import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import * as next from 'next';

export function createServer(
  req: express.Request | IncomingMessage,
  res: express.Response | ServerResponse
) {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev, conf: { distDir: 'next' } });
  const handle = app.getRequestHandler();
  app
    .prepare()
    .then(() => {
      const server = express();
      server.get('*', (request, response) => {
        handle(request, response).catch(err => {
          throw err;
        });
      });
      server(req, res);
    })
    .catch(err => {
      throw err;
    });
}
