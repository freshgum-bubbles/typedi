import { ContainerInstance } from '../../container-instance.class.mjs';
import { ResolutionConstraintFlag } from '../../types/resolution-constraint.type.mjs';

export function resolveConstrainedContainer(constraints: number, baseContainer: ContainerInstance) {
  const hasSkipSelf = constraints & ResolutionConstraintFlag.SkipSelf;
  const { parent } = baseContainer;

  if (hasSkipSelf && !parent) {
    throw new Error('SkipSelf() cannot be used on a container with no parent.');
  }

  return hasSkipSelf ? (parent as ContainerInstance) : baseContainer;
}
