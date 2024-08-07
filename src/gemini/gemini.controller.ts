import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Observable, of } from 'rxjs';
import { PreCondition } from 'src/data/pre-condition.enum';
import { Conversation, Message } from 'src/schema/conversation.schema';
import { v4 as uuidv4 } from 'uuid';
@Controller('gemini')
export class GeminiController {
  constructor(private geminiService: GeminiService) {}
  @Get()
  getUUID(): Observable<string> {
    return of(uuidv4());
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
