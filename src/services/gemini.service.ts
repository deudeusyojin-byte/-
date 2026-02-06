import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Safely access env vars; in some build setups process is not defined globally in browser
    let apiKey = '';
    try {
        apiKey = process.env['API_KEY'] || '';
    } catch (e) {
        console.warn('API_KEY not found in environment');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
      return null;
    } catch (error) {
      console.error('Gemini Image Gen Error:', error);
      return null;
    }
  }
}