import { AnyServiceDependency, DependencyPairWithConfiguration } from '../interfaces/service-dependency.interface';
import { Token } from '../token.class';
import { LazyReference } from './lazy-reference.type';
import { ServiceIdentifier } from './service-identifier.type';

/**
 * @fileoverview @ignore
 * The premise of this file is to allow for the conversion of service dependency lists into types which are appropriate
 * for consuming as part of the service's constructor.
 *
 * The main focus of the implementation is below, in the `UnpackServiceDependency` type. This type transforms
 * dependencies into their actual values.
 *
 * For a constructor passed into `ServiceSubject`, an "expected type" is returned.
 *
 * Consider the following example:
 * ```ts
 * @Service([AnotherService]) class MyService {}
 * ```
 *
 * In this case, as the `Service` overloads statically determines the class' dependencies,
 * it's able to create a type which it *expects* the constructor to be.
 * Considering the above example, the overload would expect the constructor it's going to
 * operate on to be of type `new (arg1: AnotherService) => unknown`.
 *
 * If the type doesn't match (so say the constructor implementation expects another
 * type in that dependency's place), the code won't compile without using `any`.
 *
 * Therefore, the following (thankfully) wouldn't compile:
 * ```ts
 * @Service([AnotherService])
 * class MyService {
 *   constructor (private value: number) { }
 * }
 * ```
 *
 * If you look below, we also guard against built-in types surfacing into type design. For instance, if a class uses
 * Number as a dependency, the accompanying argument in the constructor would be `number` instead of the discouraged
 * `Number` type.
 *
 * Consider the following example:
 * ```ts
 * @Service({ factory: () => new Car(2) }, [Number])
 * class Car {
 *   constructor (private modelNumber: number) { }
 * }
 * ```
 *
 * Instead of using `Number` in the constructor, we're able to use `number` in its place. This is because, for each
 * dependency, we check if the type matches any of the built-in constructors, such as Number, String and Object. If they
 * do, they're cast to their underlying native types. In the case of Number such as in the above example, that type is
 * cast to `number`. The type compiler below is specially designed to accommodate this use-case.
 *
 * ---
 *
 * One note is that in the implementation, the expected type's return value is `unknown`. This is fine, as the return
 * types of decorators doesn't actually matter to TypeScript. This makes the implementation a little bit simpler.
 *
 * The advantage of this overall approach is that it mostly keeps the type-checking decoupled from the Service decorator
 * implementation.  The actual type-checking is performed in this file. Furthermore, we get type-checking basically for
 * free; this doesn't impact the size of the final bundle at all. Sweet!
 *
 * One notable drawback of this implementation is that, without modifications to TypeScript, we've absolutely no way to
 * force `Optional`-marked parameters to possibly expect a null type. In the case of our resolution constraint bitmask,
 * it's cast to a number internally. We can't check individual flags against it.
 */

/**
 * A built-in type, which is usable as a dependency in a service implementation.
 * This needs to be kept up-to-date with the {@see BUILT_INS} constant.
 * @ignore
 */
type BuiltIn = typeof String | typeof Number | typeof Boolean | typeof Symbol | typeof Object | typeof Array;

/**
 * Map a built-in to its native type.
 * @ignore
 *
 * As built-in types can only be expressed using constructors,
 * we need to cast them to their TypeScript-friendly type, as
 * otherwise classes using these built-in types would be forced
 * to accept, for example, a String *instance* (`new String`) in the place of a String dependency.
 *
 * The [TypeScript *Do's And Don'ts* docs][dos-and-donts] suggests the following transformations:
 *
 * | Dependency     | TS Type   |
 * |----------------|-----------|
 * | **String**     | `string`  |
 * | **Number**     | `number`  |
 * | **Boolean**    | `boolean` |
 * | **Symbol**     | `symbol`  |
 * | **Object**     | `object`  |
 *
 * We extend this by also casting Array dependencies to `unknown[]`.
 *
 * [dos-and-donts]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
 */
export type MapBuiltInToNativeType<T> = T extends typeof String
  ? string
  : T extends typeof Number
  ? number
  : T extends typeof Boolean
  ? boolean
  : T extends typeof Symbol
  ? symbol
  : T extends typeof Object
  ? object
  : T extends typeof Array
  ? unknown[]
  : T;

/**
 * Map an `AnyServiceDependency` type to its true value.
 * For example, in the case of a `Token<string>`, `string` is returned.
 * @ignore
 */
// prettier-ignore
export type UnpackServiceDependency<T extends AnyServiceDependency> =
    /** Map [type, Constraints] pairs to the base type for easier unwrapping. */
    T extends DependencyPairWithConfiguration ? UnpackServiceDependency<T[0]> :
  
    /**
     * If it's a built-in (Number, String), then let's resolve to an unpacked version of it.
     * In the case of String, this would be string.
     * 
     * We need to check if the type is a built-in as otherwise, in the next case,
     * it would be implicitly matched to a ServiceIdentifier<String>, and the
     * built-in type transformer in {@see MaybeTransformBuiltIn} wouldn't work.
     * 
     * Furthermore, we need to operate on T as, in the case of a String dependency,
     * T would be StringConstructor (which equates to `typeof string`).
     */
    T extends BuiltIn ? MapBuiltInToNativeType<T> :
    
    /**
     * If it's a ServiceIdentifier, unpack it to its underlying type.
     * In the case of a class, this would resolve to an instance of the class.
     * 
     * In the case of Tokens, this resolves to the token's underlying type.
     */
    T extends ServiceIdentifier<infer U> ? U :
    
    /** If we have a Token<string> as a dependency, the constructor should accept `string` in its place. */
    T extends Token<infer U> ? MapBuiltInToNativeType<U> :
  
    /**
     * Also unpack LazyReference types to their underlying type, ensuring we also transform
     * the return type of the reference if it resolves to a built-in.
     */
    T extends LazyReference<infer U extends ServiceIdentifier> ? MapBuiltInToNativeType<UnpackServiceDependency<U>> :
    never;

/**
 * Create an appropriate type for a decorator's subject constructor,
 * where T is equal to the type of instance expected, and TDeps is
 * equal to its dependencies.
 */
export type ServiceWithDependencies<TDeps extends readonly AnyServiceDependency[], T = unknown> =
  /**
   * We can't use the TypedConstructable type here as otherwise,
   * TypeScript complains that the type instantiation is "excessively deep".
   *
   * While we're not sure how / why this fixes the issue, it does.
   *
   * Full TS error text for reference:
   *   Type instantiation is excessively deep and possibly infinite.ts(2589)
   */
  new (...args: UnpackDependencies<TDeps>) => T;

/**
 * Unpack a list of dependencies for a service, mapping each one
 * to an appropriate type for the service's constructor.
 *
 * The returned type is compatible with the array type.
 *
 * @remarks
 * The implementation of this type creates a dependency on a TypeScript version over
 * or equal to vxx.xx.xx.  This is due to prior versions not allowing mapped arrays
 * to be presented as rest parameters for function / constructors.
 * [The original issue, present since 2019](https://github.com/microsoft/TypeScript/issues/29919),
 * was fixed in a [pull request](https://github.com/microsoft/TypeScript/pull/49947) in 2023.
 * Thanks to Andarist for the great work!
 */
export type UnpackDependencies<TDeps extends readonly any[]> = {
  [TIndex in keyof TDeps]: UnpackServiceDependency<TDeps[TIndex]>;
};
