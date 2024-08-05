import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Observable, of } from 'rxjs';
import { PreCondition } from 'src/data/pre-condition.enum';
import { Conversation, Message } from 'src/schema/conversation.schema';

@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}
  @Get()
  getGemini(@Query() query: any) {
    const { prompt, precondition } = query;
    return this.geminiService.askGenerativeAI(prompt, precondition);
  }

  @Post('first')
  postGeminiFirst(
    @Body()
    body: {
      prompt: string;
      precondition: PreCondition;
    },
  ): Observable<Conversation[]> {
    console.log('postGeminiFirst', body);
    const { prompt, precondition } = body;
    return of([]);
  }

  @Post()
  postGemini(
    @Body()
    body: {
      prompt: string;
      precondition: PreCondition;
      id?: string;
      messageList?: Message[];
    },
  ): Observable<Conversation> {
    console.log('postGemini', body);
    const { prompt, precondition, messageList, id } = body;
    return this.geminiService.askGenmini(prompt, precondition, id, messageList);
  }
}
