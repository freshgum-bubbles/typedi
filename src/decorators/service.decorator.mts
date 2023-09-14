/**
 * @fileoverview
 * This file contains the `@Service` decorator, which provides an API for
 * the registration of individual services (along with their dependencies).
 * Mainly, the Service function performs argument normalization, and then
 * passes the normalized metadata to the container.
 * The main service logic is hosted by the {@link ContainerInstance} class.
 */
import { ServiceOptions, ServiceOptionsWithDependencies } from '../interfaces/service-options.interface.mjs';
import { Constructable } from '../types/constructable.type.mjs';
import { ContainerInstance } from '../container-instance.class.mjs';
import { ServiceMetadata } from '../interfaces/service-metadata.interface.mjs';
import { SERVICE_METADATA_DEFAULTS } from '../constants/service-defaults.const.mjs';
import { AnyServiceDependency } from '../interfaces/service-dependency.interface.mjs';
import { wrapDependencyAsResolvable } from '../utils/wrap-resolvable-dependency.mjs';
import { isArray } from '../utils/is-array.util.mjs';

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
export function Service(dependencies: AnyServiceDependency[]): ClassDecorator;

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
export function Service<T = unknown>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: AnyServiceDependency[]
): ClassDecorator;

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
export function Service(options: ServiceOptionsWithDependencies<Constructable<unknown>>): ClassDecorator;
export function Service<T>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyServiceDependency[],
  maybeDependencies?: AnyServiceDependency[]
): ClassDecorator {
  return targetConstructor => {
    if (optionsOrDependencies == null || targetConstructor == null) {
      throw Error('The @Service decorator was not used correctly.');
    }

    /** A list of dependencies resolved from the arguments provided to the function. */
    let resolvedDependencies!: AnyServiceDependency[];
    const optionsOrDependenciesIsArray = isArray(optionsOrDependencies);

    if (optionsOrDependenciesIsArray) {
      /**
       * If our first argument is an array, then the user has not specified any options,
       * and has instead filled the slot with a list of dependencies.
       */
      resolvedDependencies = optionsOrDependencies;
    } else if (isArray(maybeDependencies)) {
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

    /**
     * A default list of options for this service.
     * These are used when the options are not explicitly provided to the function.
     * However, if options are passed, these are merged in as defaults.
     */
    const metadata: Omit<ServiceMetadata<T>, 'dependencies'> & { container: ContainerInstance } = {
      id: targetConstructor,
      type: targetConstructor as unknown as Constructable<T>,
      ...SERVICE_METADATA_DEFAULTS,
      container: ContainerInstance.defaultContainer,
    };

    if (!optionsOrDependenciesIsArray) {
      Object.assign(metadata, optionsOrDependencies);
    }

    const wrappedDependencies = resolvedDependencies.map((dependency, index) =>
      wrapDependencyAsResolvable(dependency, metadata, index)
    );

    const { id, container } = metadata;

    /**
     * If the target is already registered, `@Service` may have been called twice on the same class.
     * Alternatively, the consumer may be trying to override a well-known key in the container.
     *
     * Not throwing here may lead to confusion as, in the case of duplicate calls to `@Service` referencing
     * the same identifier, the "winning" implementation which is *actually* used may be unclear.
     *
     * We disable recursiveness in the check here to allow for sub-containers to override well-known
     * IDs in parent containers.
     * This makes it easier to immutably extend containers in-place by way of sub-containers.
     *
     * One final note: It's also very important to ensure that the duplication checks are *not* performed
     * if the `multiple` bit is set to true.  In that case, we'd very much want it to function like an
     * ordinary `Container.set` call, wherein the same operation would result in this service being added
     * to an internal array of values for the specified identifier.
     */
    if (container.has(id, false) && !metadata.multiple) {
      throw Error(`@Service() has been called twice upon ${targetConstructor.name}, or you have used an ID twice.`);
    }

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
