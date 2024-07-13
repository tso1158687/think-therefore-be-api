import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { ConversationDTO } from 'src/dto/conversation.dto';
import { Conversation } from 'src/schema/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation') private conversationModel: Model<Conversation>,
  ) {}

  async create(conversationDTO: ConversationDTO): Promise<Conversation> {
    const createdConversation = new this.conversationModel(conversationDTO);
    return createdConversation.save();
  }

  addConversation(conversationDTO: ConversationDTO): Observable<Conversation> {
    const createdConversation = new this.conversationModel(conversationDTO);
    return from(createdConversation.save());
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversationModel.find().exec();
  }

  async findById(id: string): Promise<Conversation> {
    return this.conversationModel.findById(id).exec();
  }

  async update(
    id: string,
    conversationDTO: ConversationDTO,
  ): Promise<Conversation> {
    return this.conversationModel
      .findByIdAndUpdate(id, conversationDTO, { new: true })
      .exec();
  }

  //   async delete(id: string): Promise<any> {
  //     return this.conversationModel.findByIdAndRemove(id).exec();
  //   }
}
