import { Schema, Document } from 'mongoose';

export const MessagePartSchema = new Schema({
  text: { type: String, required: true },
});

export const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  parts: { type: [MessagePartSchema], required: true },
});

export const ConversationSchema = new Schema(
  {
    messages: { type: [MessageSchema], required: true },
    isPrivate: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
  },
  {
    timestamps: true, // 自動管理 createdAt 和 updatedAt
  },
);

export interface MessagePart extends Document {
  text: string;
}

export interface Message extends Document {
  role: 'user' | 'model';
  parts: MessagePart[];
  precondition?: string;
}

export interface Conversation extends Document {
  _id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
