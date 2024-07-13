import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationDTO } from 'src/dto/conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(@Body() conversationDTO: ConversationDTO) {
    return this.conversationService.create(conversationDTO);
  }

  @Get()
  async findAll() {
    return this.conversationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.conversationService.findById(id);
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
