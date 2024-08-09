import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { ConversationDTO } from 'src/dto/conversation.dto';
import { Conversation, Message } from 'src/schema/conversation.schema';

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

  getConversationList(): Observable<Conversation[]> {
    console.log('getConversationList');
    return from(this.conversationModel.find().sort({ createdAt: -1 }).exec());
  }

  getConversationWithPagination(
    page = 1,
    limit = 10,
    sort?: string,
  ): Observable<Conversation[]> {
    const skip = (page - 1) * limit;
    return from(
      this.conversationModel
        .find()
        .sort({ createdAt: sort === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
    );
  }

  updateConversation(
    id: string,
    conversationDTO: ConversationDTO,
  ): Observable<Conversation> {
    return from(
      this.conversationModel
        .findByIdAndUpdate(id, conversationDTO, { new: true })
        .exec(),
    );
  }

  updateMessages(id: string, messages: Message[]): Observable<Conversation> {
    return from(
      this.conversationModel
        .findByIdAndUpdate(id, { $push: { messages: messages } }, { new: true })
        .exec(),
    );
  }

  getConversationById(id: string): Observable<Conversation> {
    return from(
      this.conversationModel
        .findByIdAndUpdate(id, { $inc: { count: 1 } }, { new: true })
        .exec(),
    );
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
