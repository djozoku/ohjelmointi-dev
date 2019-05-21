import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { accountCredential } from '../shared/credentials/server';
import * as Application from './server';

const firebase = admin.initializeApp({
  credential: admin.credential.cert(accountCredential),
  databaseURL: 'https://ohjelmointi-dev-testsite.firebaseio.com',
});

export const nextApp = functions.https.onRequest((req, res) => {
  Application.createServer(req, res, firebase).catch((err) => {
    throw err;
  });
});
