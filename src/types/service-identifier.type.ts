import { Token } from '../token.class';
import { Constructable } from './constructable.type';
import { AbstractConstructable } from './abstract-constructable.type';

/**
 * An identifier which can be stored as a key for a given service or value.
 * @public
 */
export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | Token<T>
  | string;
