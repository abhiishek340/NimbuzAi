import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");

interface TransformContentParams {
  content: string;
  platform: string;
  tone?: string;
  mediaFiles?: File[];
}

export const aiService = {
  async transformContent({ content, platform, tone = 'professional' }) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const platformPrompts = {
        twitter: "Transform for Twitter: Keep it under 280 characters, engaging, with 2-3 relevant hashtags.",
        linkedin: "Transform for LinkedIn: Professional tone, industry insights, structured with paragraphs, 2-3 relevant hashtags.",
        instagram: "Transform for Instagram: Visual-friendly, engaging tone, add line breaks, include up to 20 relevant hashtags.",
        facebook: "Transform for Facebook: Conversational tone, encourage engagement, can be longer format.",
        tiktok: "Transform for TikTok: Casual, trendy language, short and punchy, include trending hashtags.",
        snapchat: "Transform for Snapchat: Very casual, young audience, short and snappy content."
      };

      const prompt = `
        Transform this content for ${platform}:
        "${content}"

        ${platformPrompts[platform] || "Transform while maintaining the core message."}
        
        Requirements:
        1. Keep the core message
        2. Make it engaging for ${platform}
        3. Use a ${tone} tone
        4. Format appropriately
        5. Add relevant hashtags
        
        Return only the transformed content, no explanations.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const transformedContent = response.text();

      // Validate and clean the response
      if (!transformedContent) {
        throw new Error('No content generated');
      }

      return {
        success: true,
        transformedContent: transformedContent.trim()
      };

    } catch (error) {
      console.error('AI transformation error:', error);
      return {
        success: false,
        error: 'Failed to transform content',
        transformedContent: null
      };
    }
  },

  getPlatformSpecificPrompt(platform: string): string {
    const prompts = {
      twitter: "Keep it concise and engaging. Include 2-3 relevant hashtags.",
      linkedin: "Professional tone, industry-relevant insights, use paragraphs.",
      instagram: "Visual-friendly description, engaging tone, relevant hashtags.",
      tiktok: "Casual, trendy language, relevant hashtags, call-to-action.",
      facebook: "Conversational tone, encourage engagement, longer format ok.",
      snapchat: "Very casual, young audience, short and snappy."
    };

    return prompts[platform] || "Transform while maintaining the message.";
  },

  async analyzeMedia(file: File): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      const prompt = `Analyze this media and suggest relevant hashtags and description.`;
      
      const result = await model.generateContent([prompt, { inlineData: { data: base64, mimeType: file.type } }]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Media analysis error:', error);
      throw new Error('Failed to analyze media');
    }
  },

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  async generateIdeas(prompt: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(`
        Generate 4 creative content ideas based on this prompt: "${prompt}"
        Format each idea with a title and content.
        Make them engaging and suitable for social media.
        Include relevant hashtags.
        
        Return in this format:
        [
          {
            "title": "Idea title",
            "content": "Full content with hashtags"
          }
        ]
      `);

      const response = await result.response;
      const text = response.text();
      
      try {
        // Parse the response as JSON
        const ideas = JSON.parse(text);
        return {
          success: true,
          ideas: ideas
        };
      } catch {
        // If JSON parsing fails, create structured content from the text
        const fallbackIdeas = text.split('\n\n').map((idea, index) => ({
          title: `Idea ${index + 1}`,
          content: idea.trim()
        }));
        
        return {
          success: true,
          ideas: fallbackIdeas
        };
      }
    } catch (error) {
      console.error('Idea generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate ideas'
      };
    }
  }
}; 