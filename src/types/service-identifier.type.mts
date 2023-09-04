import { Token } from '../token.class.mts';
import { Constructable } from './constructable.type.mts';
import { AbstractConstructable } from './abstract-constructable.type.mts';

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
