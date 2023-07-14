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
 */
export type ExtractToken<T> = T extends Token<infer U> ? U : never;
