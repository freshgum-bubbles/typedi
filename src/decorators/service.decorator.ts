/**
 * @fileoverview
 * This file contains the `@Service` decorator, which provides an API for
 * the registration of individual services (along with their dependencies).
 * Mainly, the Service function performs argument normalization, and then
 * passes the normalized metadata to the container.
 * The main service logic is hosted by the {@link ContainerInstance} class.
 */
import { ServiceOptions, ServiceOptionsWithDependencies } from '../interfaces/service-options.interface';
import { Constructable } from '../types/constructable.type';
import { ContainerInstance } from '../container-instance.class';
import { formatClassName } from '../utils/format-class-name';
import { ServiceMetadata } from '../interfaces/service-metadata.interface';
import { SERVICE_METADATA_DEFAULTS } from '../constants/service-defaults.const';
import { BUILT_INS } from '../constants/builtins.const';
import { CannotInstantiateBuiltInError } from '../error/cannot-instantiate-builtin-error';
import { AnyServiceDependency } from '../interfaces/service-dependency.interface';
import { wrapDependencyAsResolvable } from '../utils/wrap-resolvable-dependency';
import { ServiceWithDependencies } from '../types/service-subject.type';
import { CannotInstantiateValueError } from '../error/cannot-instantiate-value.error';

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This ia a TypeScript decorator.**
 *
 * @example
 * ```ts
 * @Service([ ])
 * class OtherService { }
 *
 * @Service([OtherService])
 * class MyService {
 *   constructor (private otherService: OtherService) { }
 * }
 * ```
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @group Decorators
 *
 * @returns A decorator which is then used upon a class.
 */
export function Service<T extends ServiceWithDependencies<TDependencies>, TDependencies extends AnyServiceDependency[]>
  (dependencies: TDependencies): (type: T) => void;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This ia a TypeScript decorator.**
 *
 * @example
 * ```ts
 * const OTHER_SERVICE = new Token<OtherService>();
 *
 * @Service({ id: OTHER_SERVICE }, [ ])
 * class OtherService { }
 *
 * @Service([OTHER_SERVICE])
 * class MyService {
 *   constructor (private otherService: OtherService) { }
 * }
 * ```
 *
 * @param options The options to use for initialisation of the service.
 * Documentation for the options can be found in ServiceOptions.
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @see {@link ServiceOptions}
 *
 * @group Decorators
 *
 * @returns A decorator which is then used upon a class.
 */
export function Service<T extends ServiceWithDependencies<TDependencies>, TDependencies extends AnyServiceDependency[]>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: AnyServiceDependency[]
): (type: T) => void;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This ia a TypeScript decorator.**
 *
 * @example
 * ```ts
 * const OTHER_SERVICE = new Token<OtherService>();
 *
 * @Service({ id: OTHER_SERVICE, dependencies: [ ] })
 * class OtherService { }
 *
 * @Service({ dependencies: [OtherService] })
 * class MyService {
 *   constructor (private otherService: OtherService) { }
 * }
 * ```
 *
 * @param options The options to use for initialisation of the service.
 * Documentation for the options can be found in ServiceOptions.
 * The options must also contain the dependencies that the service requires.
 *
 * If found, the specified dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @group Decorators
 *
 * @returns A decorator which is then used upon a class.
 */
export function Service<T extends ServiceWithDependencies<TDependencies>, TDependencies extends AnyServiceDependency[]>(
  options: ServiceOptions<Constructable<unknown>> & { dependencies: AnyServiceDependency[] }
): (type: T) => void;

export function Service<T extends ServiceWithDependencies<TDependencies>, TDependencies extends AnyServiceDependency[]>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyServiceDependency[],
  maybeDependencies?: TDependencies
): (type: T) => void {
  return targetConstructor => {
    if (optionsOrDependencies == null || targetConstructor == null) {
      // todo: more info in these error messages!!!
      throw Error('The required configuration was not passed.');
    }

    /** A list of dependencies resolved from the arguments provided to the function. */
    let resolvedDependencies!: AnyServiceDependency[];

    if (Array.isArray(optionsOrDependencies)) {
      /**
       * If our first argument is an array, then the user has not specified any options,
       * and has instead filled the slot with a list of dependencies.
       */
      resolvedDependencies = optionsOrDependencies;
    } else if (Array.isArray(maybeDependencies)) {
      resolvedDependencies = maybeDependencies;
    } else if ('dependencies' in optionsOrDependencies) {
      /**
       * The first argument is of type `ServiceOptions<T>` with dependencies.
       * We can access its "dependencies" property and then map the unwrapped types.
       */
      resolvedDependencies = (optionsOrDependencies as any).dependencies;
    }

    if (!resolvedDependencies) {
      /** At this point we have exhausted all options, so throw. */
      throw Error('The dependencies provided were not able to be resolved.');
    }

    const wrappedDependencies = resolvedDependencies.map(wrapDependencyAsResolvable);

    /**
     * A default list of options for this service.
     * These are used when the options are not explicitly provided to the function.
     * However, if options are passed, these are merged in as defaults.
     */
    let metadata: Omit<ServiceMetadata<T>, 'dependencies'> & { container: ContainerInstance } = {
      id: targetConstructor,
      type: targetConstructor as unknown as Constructable<T>,
      ...SERVICE_METADATA_DEFAULTS,
      container: ContainerInstance.defaultContainer,
    };

    if (!Array.isArray(optionsOrDependencies)) {
      metadata = { ...metadata, ...optionsOrDependencies };

      /**
       * Remove the decorators from the options forcibly.
       * Otherwise, our type-wrapped dependencies passed to ContainerInstance.set are ignored.
       */
      delete (metadata as any).dependencies;
    }

    const { id, container } = metadata;

    /**
     * If the target is already registered, `@Service` has been called twice on the same constructor.
     * Throw an error, as not doing so would raise ambiguity regarding the implementation.
     * This is most likely user error, as the function should __never__ be called twice.
     */
    if (container.has(id) && !metadata.multiple) {
      throw Error(
        `@Service() has been called twice upon ${formatClassName(targetConstructor)}, or you have used an ID twice.`
      );
    }

    /**
     * Check any available eager types immediately, so we can quickly raise an error
     * if they are invalid, instead of when the service is injected.
     */
    wrappedDependencies.forEach(({ typeWrapper }, index) => {
      const { eagerType } = typeWrapper;

      if (eagerType !== null) {
        const type = typeof typeWrapper;

        if (type !== 'function' && type !== 'object' && type !== 'string') {
          throw new CannotInstantiateValueError(
            `The identifier provided at index ${index} for service ${formatClassName(targetConstructor)} is invalid.`
          );
        } else if (metadata.factory == null && (BUILT_INS as unknown[]).includes(eagerType)) {
          /**
           * Ensure the service does not contain built-in types (Number, Symbol, Object, etc.)
           * without also holding a factory to manually create an instance of the constructor.
           */
          throw new CannotInstantiateBuiltInError((eagerType as Constructable<unknown>)?.name ?? eagerType);
        }
      }
    });

    /**
     * The `.set(Omit<ServiceOptions<unknown>, "dependencies">, TypeWrapper[])` overload is used here.
     * TypeScript downcasts the metadata to the type above.
     *
     * By default, this is set to `defaultContainer`.
     * Therefore, it will be bound to that.
     */
    container.set(metadata, wrappedDependencies);
  };
}
