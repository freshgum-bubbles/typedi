import { Resolvable } from '../interfaces/resolvable.interface';
import { AnyServiceDependency, DependencyPairWithConfiguration } from '../interfaces/service-dependency.interface';
import { AnyInjectIdentifier } from '../types/inject-identifier.type';
import { TypeWrapper } from '../types/type-wrapper.type';
import { resolveToTypeWrapper } from './resolve-to-type-wrapper.util';

/**
 * Wrap a given dependency as a {@link Resolvable}, containing both
 * its {@link TypeWrapper} representation, along with any constraints
 * specified by the creator of the object.
 * @private
 */
export function wrapDependencyAsResolvable(dependency: AnyServiceDependency): Resolvable {
  let constraints!: number | undefined;
  let typeWrapper!: TypeWrapper;

  if (Array.isArray(dependency)) {
    /** The dependency is a [ID, options] pair. Let's parse it as such. */
    const [id, options] = dependency as DependencyPairWithConfiguration;

    /** Perform some very basic sanity checking on the pair. */
    if (id == null || options == null) {
      // TODO: make this more descriptive
      throw Error('The dependency pair was not instantiated correctly.');
    }

    if (typeof options === 'number') {
      constraints = options;
    }

    typeWrapper = resolveToTypeWrapper(id);
  } else {
    /** The dependency is an injectable identifier. */
    typeWrapper = resolveToTypeWrapper(dependency as AnyInjectIdentifier);
  }

  return {
    constraints,
    typeWrapper,
  };
}
