import axios from 'axios';

interface PostContent {
  content: string;
  mediaFiles?: File[];
  platform: string;
  scheduledDate?: Date | null;
}

export const socialMediaService = {
  async postToTwitter(content: string, mediaFiles?: File[]) {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (mediaFiles) {
        mediaFiles.forEach(file => formData.append('media', file));
      }

      const response = await axios.post('/api/social/twitter/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to post to Twitter');
    }
  },

  async postToLinkedIn(content: string, mediaFiles?: File[]) {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (mediaFiles) {
        mediaFiles.forEach(file => formData.append('media', file));
      }

      const response = await axios.post('/api/social/linkedin/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to post to LinkedIn');
    }
  },

  // Similar functions for other platforms
  async postToSocialMedia({ content, mediaFiles, platform, scheduledDate }: PostContent) {
    const formData = new FormData();
    formData.append('content', content);
    if (mediaFiles) {
      mediaFiles.forEach(file => formData.append('media', file));
    }
    if (scheduledDate) {
      formData.append('scheduledDate', scheduledDate.toISOString());
    }

    const response = await axios.post(`/api/social/${platform}/post`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  }
}; 