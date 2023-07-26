import { ResolutionConstraintFlag, ResolutionConstraintsDescriptor } from '../types/resolution-constraint.type';

/**
 * Construct a resolution constraint bitmask from the provided constraint descriptor.
 * @private
 *
 * @param descriptor The descriptor containing resolution constraints for a given service.
 *
 * @returns A bitmask containing the options stored in the descriptor.
 */
export function createResolutionConstraintMask(descriptor: ResolutionConstraintsDescriptor) {
  /** Construct an empty mask. */
  let mask = 0b000;

  if (descriptor.many) {
    mask |= ResolutionConstraintFlag.Many;
  }

  if (descriptor.optional) {
    mask |= ResolutionConstraintFlag.Optional;
  }

  if (descriptor.self) {
    mask |= ResolutionConstraintFlag.Self;
  }

  if (descriptor.skipSelf) {
    mask |= ResolutionConstraintFlag.SkipSelf;
  }

  return mask;
}
