import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  providers: [GeminiService],
  controllers: [GeminiController],
})
export class GeminiModule {}
