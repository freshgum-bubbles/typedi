import { Optional, Service } from '@freshgum/typedi';
import { GREETING_USERNAME } from './username.token';

export class GreetingService {
  constructor(private userName: string) {}

  getGreeting() {
    return `Hello, ${this.userName ?? 'person'}!`;
  }
}

Service({ scope: 'transient' }, [[GREETING_USERNAME, Optional()]])(GreetingService);
