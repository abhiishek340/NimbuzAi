import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content, platform, tone, maxLength } = req.body;

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
      ${maxLength ? `6. Keep it under ${maxLength} characters` : ''}
      
      Return only the transformed content, no explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const transformedContent = response.text();

    if (!transformedContent) {
      throw new Error('No content generated');
    }

    return res.status(200).json({ 
      success: true,
      transformedContent: transformedContent.trim() 
    });

  } catch (error) {
    console.error('Transform API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error transforming content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 