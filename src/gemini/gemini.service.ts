import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
@Injectable()
export class GeminiService {
  private genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  private aiModel = this.genAi.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
  });

  async askGenerativeAI(prompt: string): Promise<string> {
    const result = await this.aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }
}
