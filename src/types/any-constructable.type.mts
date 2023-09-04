import { AbstractConstructable } from './abstract-constructable.type.mjs';
import { Constructable } from './constructable.type.mjs';

/**
 * A type matching any form of constructable.
 */
export type AnyConstructable<T = unknown> = Constructable<T> | AbstractConstructable<T>;
