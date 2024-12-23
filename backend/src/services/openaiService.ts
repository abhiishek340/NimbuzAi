import { Configuration, OpenAIApi } from 'openai';

export class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await this.openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      });
      return response.data.choices[0].text || '';
    } catch (error) {
      throw new Error('Failed to generate content');
    }
  }
} 