/**
 * Generic type for class definitions.
 * Example usage:
 * ```
 * function createSomeInstance(myClassDefinition: TypedConstructable<MyClass, [number]>) {
 *   return new myClassDefinition(2);
 * }
 * ```
 */
export type TypedConstructable<T, TArgs extends unknown[]> = new (...args: TArgs) => T;
