import axios from 'axios';

export const imageGenerationService = {
  async generateImage(prompt: string) {
    try {
      console.log('Starting image generation with prompt:', prompt);
      
      // Enhanced prompt but keeping it concise
      const enhancedPrompt = `photograph of ${prompt}`;
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
              negative_prompt: "blurry, bad quality",
              num_inference_steps: 20, // Reduced steps
              guidance_scale: 7.0,
              width: 512,  // Reduced size
              height: 512, // Reduced size
              seed: Math.floor(Math.random() * 1000000)
            }
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 500) {
          // If out of memory, retry with even smaller parameters
          return this.generateImageFallback(prompt);
        }
        if (response.status === 503) {
          // Model is loading
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
          return this.generateImage(prompt); // Retry
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated image is empty');
      }

      const imageUrl = URL.createObjectURL(blob);
      console.log('Image generated successfully:', imageUrl);
      
      return {
        success: true,
        imageUrl: imageUrl
      };

    } catch (error) {
      console.error('Image generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      };
    }
  },

  // Fallback method with minimal parameters
  async generateImageFallback(prompt: string) {
    try {
      console.log('Attempting fallback image generation with minimal parameters');
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: 15, // Minimum steps
              guidance_scale: 6.0,
              width: 384,  // Smaller size
              height: 384, // Smaller size
              seed: Math.floor(Math.random() * 1000000)
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fallback failed: ${errorText}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      return {
        success: true,
        imageUrl: imageUrl
      };

    } catch (error) {
      console.error('Fallback image generation error:', error);
      return {
        success: false,
        error: 'Failed to generate image with fallback method'
      };
    }
  }
}; 