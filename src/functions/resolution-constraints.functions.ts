import { ResolutionConstraintFlag } from '../types/resolution-constraint.type';

/**
 * If the identifier cannot be found, substitute it with `null`.
 * @experimental
 *
 * The constraints supported are listed in {@link ResolutionConstraintFlag}.
 *
 * @example
 * This function can be used to construct a bitmask for use
 * in the dependencies array of a service.
 * While this can be used publicly, it is mainly for use
 * within TypeDI; it allows you to configure specific constraints
 * for use when resolving a specific service.
 *
 * ```ts
 * const constraintBitMask = Optional() | Self();
 *
 * if (constraintBitMask & ResolutionConstraintFlag.Optional) {
 *   console.log('The dependency is optional.');
 * }
 * ```
 *
 * @example
 * Here is an example of this constraint as part of a service declaration:
 * ```ts
 * const NAME = new Token<string>();
 *
 * @Service([
 *   [NAME, Optional()]
 * ])
 * class MyService {
 *   constructor (private name: string | null) {
 *     // If "NAME" isn't provided in the container the service is run under,
 *     // it will be substituted with null.  Note that the container may not
 *     // be the exact one it was declared under, but a descendent.
 *   }
 * }
 * ```
 *
 * @group Resolution Constraints
 *
 * @see {@link ResolutionConstraintFlag}
 *
 * @group Resolution Constraints
 *
 * @returns The resolution constraint bit-flag for Optional.
 */
export const Optional = () => ResolutionConstraintFlag.Optional;

/**
 * Do not ascend the container tree to resolve this identifier.
 * @experimental
 *
 * The constraints supported are listed in {@link ResolutionConstraintFlag}.
 *
 * @example
 * This function can be used to construct a bitmask for use
 * in the dependencies array of a service.
 * While this can be used publicly, it is mainly for use
 * within TypeDI; it allows you to configure specific constraints
 * for use when resolving a specific service.
 *
 * ```ts
 * const constraintBitMask = Self();
 *
 * if (constraintBitMask & ResolutionConstraintFlag.Self) {
 *   console.log('The dependency will not be resolved recursively.');
 * }
 * ```
 *
 * @example
 * Here is an example of this constraint as part of a service declaration:
 * ```ts
 * const NAME = new Token<string>('name');
 * const childContainer = Container.ofChild(Symbol());
 *
 * @Service({ container: childContainer }, [
 *   [NAME, Self()]
 * ])
 * class MyService {
 *   constructor (private name: string) { }
 * }
 *
 * Container.set({ id: NAME, value: 'Joanna' });
 *
 * childContainer.get(MyService);
 * // -> throws ServiceNotFoundError(Token<name>)
 * ```
 *
 * @remarks
 * It is advised to combine this with {@link Optional}, as the usage of this
 * constraint may mean that the identifier cannot be resolved.
 *
 * @group Resolution Constraints
 *
 * @see {@link ResolutionConstraintFlag}
 *
 * @group Resolution Constraints
 *
 * @returns The resolution constraint bit-flag for Self.
 */
export const Self = () => ResolutionConstraintFlag.Self;

/**
 * Begin searching from the parent container to resolve this identifier.
 * @experimental
 *
 * The constraints supported are listed in {@link ResolutionConstraintFlag}.
 *
 * @example
 * This function can be used to construct a bitmask for use
 * in the dependencies array of a service.
 * While this can be used publicly, it is mainly for use
 * within TypeDI; it allows you to configure specific constraints
 * for use when resolving a specific service.
 *
 * ```ts
 * const constraintBitMask = SkipSelf();
 *
 * if (constraintBitMask & ResolutionConstraintFlag.Self) {
 *   console.log('The dependency will be resolved recursively from the parent.');
 * }
 * ```
 *
 * @example
 * Here is an example of this constraint as part of a service declaration:
 * ```ts
 * const NAME = new Token<string>('name');
 * const childContainer = Container.ofChild(Symbol());
 *
 * @Service({ container: childContainer }, [
 *   [NAME, SkipSelf()]
 * ])
 * class MyService {
 *   constructor (private name: string) {
 *     // In this example, $name would evaluate to Joanna instead
 *     // of Mike.  This is due to the SkipSelf decorator.
 *   }
 * }
 *
 * childContainer.set({ id: NAME, value: 'Mike' });
 * Container.set({ id: NAME, value: 'Joanna' });
 *
 * childContainer.get(MyService);
 * ```
 *
 * @see {@link ResolutionConstraintFlag}
 *
 * @group Resolution Constraints
 *
 * @returns The resolution constraint bit-flag for SkipSelf.
 */
export const SkipSelf = () => ResolutionConstraintFlag.SkipSelf;

/**
 * Resolve multiple services for this identifier via `getMany`.
 * @experimental
 *
 * The constraints supported are listed in {@link ResolutionConstraintFlag}.
 *
 * @example
 * This function can be used to construct a bitmask for use
 * in the dependencies array of a service.
 * While this can be used publicly, it is mainly for use
 * within TypeDI; it allows you to configure specific constraints
 * for use when resolving a specific service.
 *
 * ```ts
 * const constraintBitMask = Many() | SkipSelf();
 *
 * if (constraintBitMask & ResolutionConstraintFlag.Many) {
 *   console.log('The dependency will be resolved via "getMany".');
 * }
 * ```
 *
 * @see {@link ResolutionConstraintFlag}
 *
 * @group Resolution Constraints
 *
 * @returns The resolution constraint bit-flag for SkipSelf.
 */
export const Many = () => ResolutionConstraintFlag.Many;
