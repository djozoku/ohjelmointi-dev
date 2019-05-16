import { createServer } from 'http';
import * as Application from './server';

const server = createServer(Application.createServer);
server.listen('3000');
