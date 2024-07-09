import { Injectable } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { BehaviorSubject, filter } from 'rxjs';
import { PreCondition } from 'src/data/pre-condition.enum';
@Injectable()
export class GeminiService {
  apiKeyReady$ = new BehaviorSubject<boolean>(false);
  private apiKey: string;
  private genAi: GoogleGenerativeAI;
  private aiModel: GenerativeModel;

  constructor(private configService: ConfigService) {
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
}
