
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

// This is a singleton to ensure we only initialize the app once.
let app: admin.app.App;

export function getFirebaseAdminApp() {
  if (app) {
    return app;
  }

  if (!serviceAccount) {
    throw new Error('Firebase service account key is not configured. Please set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
  }

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return app;
}
