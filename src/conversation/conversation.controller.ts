import { Controller, Get, Post, Param, Body, Put, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationDTO } from 'src/dto/conversation.dto';
import { Observable } from 'rxjs';
import { Conversation } from 'src/schema/conversation.schema';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(@Body() conversationDTO: ConversationDTO) {
    return this.conversationService.create(conversationDTO);
  }

  @Get()
  getConversationList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Observable<Conversation[]> {
    return this.conversationService.getConversationWithPagination(page, limit);
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<Conversation> {
    return this.conversationService.getConversationById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() conversationDTO: ConversationDTO,
  ) {
    return this.conversationService.update(id, conversationDTO);
  }

  //   @Delete(':id')
  //   async delete(@Param('id') id: string) {
  //     return this.conversationService.delete(id);
  //   }
}
