import type { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import Instagram from 'instagram-web-api';
import Facebook from 'facebook-nodejs-business-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { platform } = req.query;
  const { content, media } = req.body;

  try {
    switch (platform) {
      case 'twitter':
        const twitterClient = new TwitterApi({
          appKey: process.env.TWITTER_API_KEY!,
          appSecret: process.env.TWITTER_API_SECRET!,
          accessToken: process.env.TWITTER_ACCESS_TOKEN!,
          accessSecret: process.env.TWITTER_ACCESS_SECRET!,
        });

        const tweetResponse = await twitterClient.v2.tweet({
          text: content,
          // Add media handling
        });

        return res.status(200).json(tweetResponse);

      case 'linkedin':
        // Using LinkedIn's REST API directly
        const linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
        const linkedinUserId = process.env.LINKEDIN_USER_ID;
        
        const linkedinResponse = await axios.post(
          `https://api.linkedin.com/v2/ugcPosts`,
          {
            author: `urn:li:person:${linkedinUserId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: content
                },
                shareMediaCategory: 'NONE'
              }
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${linkedinAccessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0'
            }
          }
        );

        return res.status(200).json(linkedinResponse.data);

      case 'instagram':
        // Instagram posting logic
        break;

      // Add other platforms...

      default:
        return res.status(400).json({ message: 'Unsupported platform' });
    }
  } catch (error) {
    console.error('Social media posting error:', error);
    return res.status(500).json({ message: 'Failed to post content' });
  }
} 