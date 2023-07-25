import { TypeWrapper } from '../types/type-wrapper.type';

/**
 * An object containing an identifier, possibly with a strict set of constraints,
 * as defined in {@link ResolutionConstraintFlag}.
 */
export interface Resolvable {
  /**
   * The constraints placed upon the resolution process of the dependency.
   * In most cases, this will be a bitmask.
   *
   * @see {@link ResolutionConstraintFlag}.
   */
  constraints?: number;

  /**
   * The type wrapper for this resolvable.
   */
  typeWrapper: TypeWrapper;
}
