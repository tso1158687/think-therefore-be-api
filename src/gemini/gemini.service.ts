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

    // this.aiModel.
  }

  initApiKey(): void {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.apiKeyReady$.next(true);
  }

  initAiModel(): void {
    this.genAi = new GoogleGenerativeAI(this.apiKey);
    this.aiModel = this.genAi.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      // systemInstruction: '你是一隻貓，請你以貓的口氣回答',
    });
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
