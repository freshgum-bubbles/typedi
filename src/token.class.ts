/**
 * A key which can be used to resolve a given service in the context of a container.
 * @public
 * 
 * @example
 * ```ts
 * // Create a blank token.
 * // You can also supply a message as the first parameter, which
 * // will then be displayed in error messages if any occur.
 * const NAME = new Token<string>();
 * 
 * // You can also use `setValue` to set the value of the token
 * // within the container. The type of the value will be 'string',
 * // as that is the type of our token.
 * Container.setValue(NAME, 'Joanna');
 * 
 * // Tokens are correctly typed, so this will return a string.
 * Container.get(NAME);
 * ```
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class Token<T> {
  /**
   * @param name Token name, optional and only used for debugging purposes.
   */
  constructor(public name?: string) {}
}
