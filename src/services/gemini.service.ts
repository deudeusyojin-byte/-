import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // API Key must be loaded from process.env as per strict instructions.
    const apiKey = process.env['API_KEY'];
    if (!apiKey) {
      console.warn('Warning: API_KEY is missing in process.env. AI features may fail.');
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      // Reverting to the documented model 'imagen-4.0-generate-001'.
      // If this throws 403, it means the API Key project does not have the necessary permissions/billing.
      // If this throws 404, it means the model name is incorrect (but 4.0 is the instruction-compliant name).
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
      
      throw new Error('이미지 데이터가 반환되지 않았습니다.');
    } catch (error: any) {
      console.error('Gemini Image Gen Error:', error);
      
      const errorMsg = error.message || '';
      
      // Handle 403 Permission Denied (Common with Imagen)
      if (error.status === 403 || errorMsg.includes('permission') || errorMsg.includes('PERMISSION_DENIED')) {
         throw new Error('API 권한 오류: Google Cloud Console에서 "Imagen API"가 활성화되어 있는지, 그리고 결제(Billing)가 등록된 프로젝트의 API Key인지 확인해주세요. (무료 티어에서는 이미지 생성이 제한될 수 있습니다.)');
      }
      
      // Handle 404 Not Found (Invalid Model Name)
      if (error.status === 404 || errorMsg.includes('NOT_FOUND')) {
         throw new Error('모델 오류: 요청한 AI 모델(imagen-4.0-generate-001)을 찾을 수 없습니다. API 키의 지역 설정이나 모델 가용성을 확인해주세요.');
      }
      
      if (error.status === 429 || errorMsg.includes('quota')) {
         throw new Error('일일 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.');
      }

      if (errorMsg.includes('Safety') || errorMsg.includes('safety')) {
         throw new Error('생성하려는 이미지가 안전 기준(Safety Filter)에 의해 차단되었습니다. 다른 내용을 입력해주세요.');
      }

      throw new Error(`이미지 생성 실패: ${errorMsg}`);
    }
  }

  async editImage(base64Image: string, editInstruction: string): Promise<string> {
    try {
      // 1. Clean the base64 string
      const base64Data = base64Image.split(',')[1];
      
      // 2. Use Gemini 2.5 Flash to understand the image context
      const analysisResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { 
            inlineData: { 
              mimeType: 'image/jpeg', 
              data: base64Data 
            } 
          },
          { 
            text: "Describe this image in high detail, focusing on the main subject, setting, lighting, and style. Keep it concise." 
          }
        ]
      });

      const description = analysisResponse.text || "An image";

      // 3. Construct a new prompt
      const compositePrompt = `Create a new image based on this description: "${description}". 
      Apply this modification strongly: "${editInstruction}". 
      Ensure the composition remains similar to the description.`;

      // 4. Generate the new image
      return await this.generateImage(compositePrompt);
    } catch (error: any) {
      console.error('Gemini Image Edit Error:', error);
      
      const errorMsg = error.message || '';
      if (error.status === 403 || errorMsg.includes('permission denied')) {
         throw new Error('API 권한 오류: API 키 권한을 확인해주세요.');
      }
      
      throw new Error(`이미지 편집 실패: ${errorMsg}`);
    }
  }
}