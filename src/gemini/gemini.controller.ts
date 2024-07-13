import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}
  @Get()
  getGemini(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.askGenerativeAI(prompt, precondition);
  }

  @Post()
  postGemini(@Body() body: any) {
    const { prompt, precondition } = body;
    return this.geminiService.askGenerativeAI(prompt, precondition);
  }

  @Get('test')
  test(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.multichat();
  }
}
