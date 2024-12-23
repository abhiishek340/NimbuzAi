import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBB1Mo47B9wufqSiLWtmlrQqGDttVodTrw");

interface TransformContentParams {
  content: string;
  platform: string;
  tone?: string;
  mediaFiles?: File[];
}

export const aiService = {
  async transformContent({ content, platform, tone = 'professional' }: TransformContentParams) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Transform this content for ${platform} platform.
        Original content: "${content}"
        
        Requirements:
        1. Maintain the core message
        2. Optimize for ${platform}'s best practices
        3. Use a ${tone} tone
        4. Include relevant hashtags if applicable
        5. Format appropriately for the platform
        
        Please provide only the transformed content without any explanations.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI transformation error:', error);
      throw new Error('Failed to transform content');
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
  }
}; 