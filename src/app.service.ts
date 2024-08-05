import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    console.log('AppService')
  }
  getHello(): string {

    return process.env.env || 'ENV not set'
  }
}
