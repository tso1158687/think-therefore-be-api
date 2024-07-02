import { Controller, Get } from '@nestjs/common';

@Controller('gemini')
export class GeminiController {
  @Get()
  getGemini() {
    console.log(process.env.TEST_CONFIG);
    return 'This will return all Gemini data';
  }
}
