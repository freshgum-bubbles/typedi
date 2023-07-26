import { Token } from '../token.class';

/**
 * Extract the type of a Token.
 *
 * @example
 * ```ts
 * const token = new Token<string>();
 * const value: ExtractToken<typeof token> = "Hello!";
 * ```
 *
 * @remarks
 * This implements <https://github.com/typestack/typedi/pull/1127>.
 */
export type ExtractToken<T> = T extends Token<infer U> ? U : never;
