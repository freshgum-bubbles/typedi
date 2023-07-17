/**
 * A collection of bit-flags describing resolution constraints to append to a bitmask.
 * @experimental
 * 
 * @group Resolution Constraints
 */
export const enum ResolutionConstraintFlag {
  /**
   * Do not ascend the container tree to resolve this identifier.
   *
   * @inheritDoc Self
   */
  Self = 0b1000,

  /**
   * Begin searching from the parent container to resolve this identifier.
   *
   * @inheritDoc SkipSelf
   */
  SkipSelf = 0b0100,

  /**
   * If the identifier cannot be found, substitute it with `null`.
   *
   * @inheritDoc Optional
   */
  Optional = 0b0010,

  /**
   * Resolve multiple services for this identifier via `getMany`.
   * The returned array is then inserted as an argument at the specified index.
   *
   * @inheritDoc Many
   */
  Many = 0b0001,
}

/**
 * A descriptor containing hints on how a certain identifier should be resolved
 * in the context of the container.
 * @experimental
 * 
 * @group Resolution Constraints
 */
export interface ResolutionConstraintsDescriptor {
  /** Do not ascend the container tree to resolve this identifier. */
  self?: boolean;

  /** Begin searching from the parent container to resolve this identifier. */
  skipSelf?: boolean;

  /** If the identifier cannot be found, substitute it with `null`.  */
  optional?: boolean;

  /**
   * Resolve multiple services for this identifier via `getMany`.
   * The returned array is then inserted as an argument at the specified index.
   */
  many?: boolean;
}
