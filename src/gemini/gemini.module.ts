import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { ConversationModule } from 'src/conversation/conversation.module';
import { GeminiGateway } from './gemini.gateway';

@Module({
  imports: [ConversationModule],
  providers: [GeminiService, GeminiGateway],
  controllers: [GeminiController],
})
export class GeminiModule {}
