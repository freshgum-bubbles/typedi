import { Token } from '../token.class.mjs';
import { Constructable } from './constructable.type.mjs';
import { AbstractConstructable } from './abstract-constructable.type.mjs';

/**
 * Unique service identifier.
 * Can be some class type, or string id, or instance of Token.
 */
export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | Token<T>
  | string;
