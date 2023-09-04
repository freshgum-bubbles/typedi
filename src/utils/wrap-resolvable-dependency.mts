import { BUILT_INS } from '../constants/builtins.const.mts';
import { CannotInstantiateBuiltInError } from '../error/cannot-instantiate-builtin-error.mts';
import { CannotInstantiateValueError } from '../error/cannot-instantiate-value.error.mts';
import { Resolvable } from '../interfaces/resolvable.interface.mts';
import { AnyServiceDependency, DependencyPairWithConfiguration } from '../interfaces/service-dependency.interface.mts';
import { ServiceOptionsWithoutDependencies } from '../interfaces/service-options.interface.mts';
import { Constructable } from '../types/constructable.type.mts';
import { AnyInjectIdentifier } from '../types/inject-identifier.type.mts';
import { TypeWrapper } from '../types/type-wrapper.type.mts';
import { formatClassName } from './format-class-name.mts';
import { resolveToTypeWrapper } from './resolve-to-type-wrapper.util.mts';

export function wrapDependencyAsResolvable(
  dependency: AnyServiceDependency,
  serviceOptions: Pick<ServiceOptionsWithoutDependencies, 'type' | 'factory'>,
  index: number
): Resolvable {
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

  /**
   * Do basic checks on dependencies here.
   * This is primarily done as a performance optimisation, as {@link ContainerInstance.set}
   * already iterates the array using this utility, so we can avoid iterating
   * the same array twice if we check each dependency inline.
   */
  const { eagerType } = typeWrapper;

  if (eagerType !== null) {
    const type = typeof typeWrapper;

    if (type !== 'function' && type !== 'object' && type !== 'string') {
      throw new CannotInstantiateValueError(
        `The identifier provided at index ${index} for service ${formatClassName(serviceOptions.type)} is invalid.`
      );
    } else if (serviceOptions.factory == null && (BUILT_INS as unknown[]).includes(eagerType)) {
      /**
       * Ensure the service does not contain built-in types (Number, Symbol, Object, etc.)
       * without also holding a factory to manually create an instance of the constructor.
       */
      throw new CannotInstantiateBuiltInError((eagerType as Constructable<unknown>)?.name ?? eagerType);
    }
  }

  return {
    constraints,
    typeWrapper,
  };
}
