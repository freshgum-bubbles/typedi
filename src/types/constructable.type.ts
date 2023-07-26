/**
 * Generic type for class definitions.
 * @public
 * 
 * @example
 * Here is an example of how to use this type:
 * ```ts
 * function createSomeInstance(myClassDefinition: Constructable<MyClass>) {
 *   return new myClassDefinition()
 * }
 * ```
 */
export type Constructable<T> = new (...args: any[]) => T;
