import { ResolutionConstraintFlag } from "../types/resolution-constraint.type";

/** 
 * If the identifier cannot be found, substitute it with `null`.
 * @experimental
 * 
 * The constraints supported are listed in {@see ResolutionConstraintFlag}.
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
 * @returns The resolution constraint bit-flag for Optional.
 */
export function Optional () {
    return ResolutionConstraintFlag.Optional;
}

/** 
 * Do not ascend the container tree to resolve this identifier.
 * @experimental
 * 
 * The constraints supported are listed in {@see ResolutionConstraintFlag}.
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
 * @returns The resolution constraint bit-flag for Self.
 */
export function Self () {
    return ResolutionConstraintFlag.Self;
}

/** 
 * Begin searching from the parent container to resolve this identifier.
 * @experimental
 * 
 * The constraints supported are listed in {@see ResolutionConstraintFlag}.
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
 * @returns The resolution constraint bit-flag for SkipSelf.
 */
export function SkipSelf () {
    return ResolutionConstraintFlag.SkipSelf;
}

/** 
 * Resolve multiple services for this identifier via `getMany`.
 * @experimental
 * 
 * The constraints supported are listed in {@see ResolutionConstraintFlag}.
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
 * @returns The resolution constraint bit-flag for SkipSelf.
 */
export function Many () {
    return ResolutionConstraintFlag.Many;
}