import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';
import { GeminiImageData } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    // Using stable model with better free tier support
    this.model = this.genAI.getGenerativeModel({ model: config.geminiModel });
  }

  /**
   * Analyze an image with a custom prompt using Gemini API
   */
  async analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<string> {
    try {
      const imageData: GeminiImageData = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      };

      const result = await this.model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
      throw new Error('Failed to analyze image with Gemini API');
    }
  }

  /**
   * Check if the Gemini API is accessible
   * Note: This doesn't make an API call to avoid consuming quota
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Verify API key exists and model is configured
      return !!(this.genAI && this.model && config.geminiApiKey.length > 0);
    } catch (error) {
      console.error('Gemini API health check failed:', error);
      return false;
    }
  }
}

export default new GeminiService();
