import { Injectable } from '@nestjs/common';
import {
  Content,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { PreCondition } from 'src/data/pre-condition.enum';
import { ConversationService } from '../conversation/conversation.service';
import { Role } from 'src/enum/role.enum';
import { MessageDTO } from 'src/dto/conversation.dto';
import { Conversation, Message } from 'src/schema/conversation.schema';
@Injectable()
export class GeminiService {
  apiKeyReady$ = new BehaviorSubject<boolean>(false);
  private apiKey: string;
  private genAi: GoogleGenerativeAI;
  private aiModel: GenerativeModel;

  constructor(
    private configService: ConfigService,
    private conversationService: ConversationService,
  ) {
    this.initApiKey();
    this.apiKeyReady$.pipe(filter((ready) => ready)).subscribe(() => {
      this.initAiModel();
    });
  }

  initApiKey(): void {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.apiKeyReady$.next(true);
  }

  initAiModel(): void {
    this.genAi = new GoogleGenerativeAI(this.apiKey);
    this.aiModel = this.genAi.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });
  }

  async askGenerativeAI(
    prompt: string,
    precondition: PreCondition = PreCondition.a,
  ): Promise<string> {
    console.log('prompt', prompt);
    console.log('precondition', precondition);
    const pre = PreCondition[precondition];
    console.log('pre', pre);
    const result = await this.aiModel.generateContent(`${prompt} ${pre}`);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  askGenmini(
    prompt: string,
    precondition: PreCondition = PreCondition.a,
    id?: string,
    messageList?: Message[],
  ): Observable<Conversation> {
    const history: Content[] = (messageList as any) ?? [];

    const pre = PreCondition[precondition];
    const chat = this.aiModel.startChat({ history });

    return from(chat.sendMessage(`${prompt} ${pre}`)).pipe(
      map((result) => result.response.text()),
      switchMap((answer) => {
        const conversation$ = id
          ? this.updateConversation(id, prompt, answer)
          : this.addConversation(prompt, answer);
        return conversation$;
      }),
    );
  }

  async askGenerativeAI2(
    prompt: string,
    precondition: PreCondition = PreCondition.a,
  ): Promise<any> {
    console.log('prompt', prompt);
    console.log('precondition', precondition);
    const pre = PreCondition[precondition];
    console.log('pre', pre);
    return await this.aiModel.generateContentStream(`${prompt}`);

    // return await this.aiModel.generateContentStream(prompt);
  }

  async multichat(): Promise<any> {
    const chat = this.aiModel.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hello, I have 2 dogs in my house.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Great to meet you. What would you like to know?' }],
        },
      ],
    });

    const msg = 'How many paws are in my house?';

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  getMessageList(prompt: string, annwer: string): MessageDTO[] {
    return [
      {
        role: Role.USER,
        parts: [{ text: prompt }],
      },
      {
        role: Role.MODEL,
        parts: [{ text: annwer }],
      },
    ];
  }

  addConversation(prompt: string, answer: string): Observable<Conversation> {
    console.log('add');
    return this.conversationService.addConversation({
      messages: this.getMessageList(prompt, answer),
    });
  }

  updateConversation(
    id: string,
    question: string,
    asnwer: string,
  ): Observable<Conversation> {
    const messages: Content[] = [
      {
        role: Role.USER,
        parts: [{ text: question }],
      },
      {
        role: Role.MODEL,
        parts: [
          {
            text: asnwer,
          },
        ],
      },
    ];
    console.log('update', messages);
    return this.conversationService.updateMessages(id, messages as Message[]);
  }
}
