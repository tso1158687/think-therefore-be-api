import { Controller, Get, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}
  @Get()
  getGemini(@Query() query: any) {
    console.log(process.env.TEST_CONFIG);
    const { prompt } = query;
    return this.geminiService.askGenerativeAI(prompt);
  }
}
