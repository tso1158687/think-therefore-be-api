import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Observable } from 'rxjs';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}
  @Get()
  getGemini(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.askGenerativeAI(prompt, precondition);
  }

  @Post()
  postGemini(@Body() body: any): Observable<string> {
    console.log('postGemini', body);
    const { prompt, precondition } = body;
    // return this.geminiService.askGenerativeAI(prompt, precondition);
    return this.geminiService.askGenmini(prompt, precondition);
  }

  @Get('test')
  test(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.multichat();
  }
}
