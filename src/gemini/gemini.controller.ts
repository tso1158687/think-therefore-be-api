import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Observable } from 'rxjs';
import { PreCondition } from 'src/data/pre-condition.enum';
import { Conversation } from 'src/schema/conversation.schema';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}
  @Get()
  getGemini(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.askGenerativeAI(prompt, precondition);
  }

  @Post()
  postGemini(
    @Body()
    body: {
      prompt: string;
      precondition: PreCondition;
      id?: string;
      conversationList?: Conversation[];
    },
  ): Observable<string> {
    console.log('postGemini', body);
    const { prompt, precondition, conversationList, id } = body;
    return this.geminiService.askGenmini(
      prompt,
      precondition,
      id,
      conversationList,
    );
  }

  @Get('test')
  test(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.multichat();
  }
}
