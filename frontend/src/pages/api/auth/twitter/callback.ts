import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code, state } = req.query;
    const codeVerifier = req.cookies.twitter_code_verifier;

    if (!code || !codeVerifier) {
      throw new Error('Missing required parameters');
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code: code as string,
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Store the tokens securely (in database/session)
    // For now, we'll store in cookies
    res.setHeader('Set-Cookie', [
      `twitter_access_token=${tokenResponse.data.access_token}; HttpOnly; Secure; Path=/; SameSite=Lax`,
      `twitter_refresh_token=${tokenResponse.data.refresh_token}; HttpOnly; Secure; Path=/; SameSite=Lax`,
    ]);

    // Redirect back to the app
    res.redirect('/?connection=success');
  } catch (error) {
    console.error('Twitter callback error:', error);
    res.redirect('/?connection=failed');
  }
} 