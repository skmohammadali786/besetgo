
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
      const idToken = authorization.split('Bearer ')[1];
      const decodedToken = await getAuth(getFirebaseAdminApp()).verifyIdToken(idToken);

      if (decodedToken) {
        // 5 days expiration.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await getAuth(getFirebaseAdminApp()).createSessionCookie(idToken, { expiresIn });
        const options = { name: 'session', value: sessionCookie, maxAge: expiresIn, httpOnly: true, secure: true };

        const response = NextResponse.json({ status: 'success' }, { status: 200 });
        response.cookies.set(options);
        return response;
      }
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
