import { AbstractConstructable } from './abstract-constructable.type.mts';
import { Constructable } from './constructable.type.mts';

/**
 * A type matching any form of constructable.
 */
export type AnyConstructable<T = unknown> = Constructable<T> | AbstractConstructable<T>;
