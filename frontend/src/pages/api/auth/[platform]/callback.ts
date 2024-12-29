import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { platform } = req.query;
  const { code } = req.query;

  try {
    // Here you would exchange the code for access tokens
    // Store the tokens securely in your database
    // Associate them with the user's account

    // Redirect back to the app
    res.redirect('/?connection=success');
  } catch (error) {
    console.error(`${platform} auth error:`, error);
    res.redirect('/?connection=failed');
  }
} 