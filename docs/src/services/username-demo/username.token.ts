import { Token } from '@freshgum/typedi';

export const GREETING_USERNAME = new Token<string>('The username of the current user.');
