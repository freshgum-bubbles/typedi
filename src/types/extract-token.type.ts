import { Token } from '../token.class';

/**
 * Extract the type of a Token.
 * @public
 *
 * @example
 * ```ts
 * const token = new Token<string>();
 * const value: ExtractToken<typeof token> = "Hello!";
 * ```
 *
 * @remarks
 * This implements [typestack/typedi#1127](https://github.com/typestack/typedi/pull/1127).
 */
export type ExtractToken<T> = T extends Token<infer U> ? U : never;
