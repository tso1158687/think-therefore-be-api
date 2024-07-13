export class MessagePartDTO {
  text: string;
}

export class MessageDTO {
  role: 'user' | 'model';
  parts: MessagePartDTO[];
}

export class ConversationDTO {
  _id?: string;
  messages: MessageDTO[];
  createdAt?: Date;
  updatedAt?: Date;
}
