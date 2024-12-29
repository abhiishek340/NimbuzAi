import axios from 'axios';
import { generateCodeVerifier, generateCodeChallenge } from './cryptoUtils';

export const authService = {
  async connectPlatform(platform: string) {
    const platformConfigs = {
      twitter: {
        url: 'https://twitter.com/i/oauth2/authorize',
        clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
        scope: 'tweet.read tweet.write users.read offline.access',
        redirectUri: `${window.location.origin}/api/auth/twitter/callback`,
      },
      linkedin: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
        scope: 'r_liteprofile w_member_social',
        redirectUri: `${window.location.origin}/api/auth/linkedin/callback`
      },
      instagram: {
        url: 'https://api.instagram.com/oauth/authorize',
        clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
        scope: 'user_profile,user_media',
        redirectUri: `${window.location.origin}/api/auth/instagram/callback`
      },
      facebook: {
        url: 'https://www.facebook.com/v12.0/dialog/oauth',
        clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
        scope: 'pages_show_list,pages_read_engagement,pages_manage_posts',
        redirectUri: `${window.location.origin}/api/auth/facebook/callback`
      },
      tiktok: {
        url: 'https://www.tiktok.com/auth/authorize/',
        clientId: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID,
        scope: 'user.info.basic,video.publish',
        redirectUri: `${window.location.origin}/api/auth/tiktok/callback`
      },
      snapchat: {
        url: 'https://accounts.snapchat.com/accounts/oauth2/authorize',
        clientId: process.env.NEXT_PUBLIC_SNAPCHAT_CLIENT_ID,
        scope: 'snapchat-marketing-api',
        redirectUri: `${window.location.origin}/api/auth/snapchat/callback`
      }
    };

    const config = platformConfigs[platform];
    if (!config) throw new Error('Invalid platform');

    try {
      if (platform === 'twitter') {
        // Generate PKCE values
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        // Store code verifier in session storage for the callback
        sessionStorage.setItem('twitter_code_verifier', codeVerifier);
        
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: config.clientId!,
          redirect_uri: config.redirectUri,
          scope: config.scope,
          state: crypto.randomUUID(),
          code_challenge: codeChallenge,
          code_challenge_method: 'S256'
        });

        window.location.href = `${config.url}?${params.toString()}`;
      } else {
        // Handle other platforms...
        const params = new URLSearchParams({
          client_id: config.clientId!,
          redirect_uri: config.redirectUri,
          scope: config.scope,
          response_type: 'code',
          state: crypto.randomUUID()
        });

        window.location.href = `${config.url}?${params.toString()}`;
      }
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
      throw error;
    }
  },

  async verifyConnection(platform: string): Promise<boolean> {
    try {
      const response = await axios.get(`/api/auth/${platform}/verify`);
      return response.data.isConnected;
    } catch (error) {
      console.error(`Error verifying ${platform} connection:`, error);
      return false;
    }
  }
}; 