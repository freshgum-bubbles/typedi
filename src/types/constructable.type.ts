/**
 * Generic type for class definitions.
 * @public
 * 
 * Example usage:
 * ```
 * function createSomeInstance(myClassDefinition: Constructable<MyClass>) {
 *   return new myClassDefinition()
 * }
 * ```
 */
export type Constructable<T> = new (...args: any[]) => T;
