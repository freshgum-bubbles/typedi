/**
 * @fileoverview
 * This file contains the `@Service` decorator, which provides an API for
 * the registration of individual services (along with their dependencies).
 * Mainly, the Service function performs argument normalization, and then
 * passes the normalized metadata to the container.
 * The main service logic is hosted by the {@see ContainerInstance} class.
 */
import { ServiceOptions } from '../interfaces/service-options.interface';
import { EMPTY_VALUE } from '../empty.const';
import { Constructable } from '../types/constructable.type';
import { ContainerInstance } from '../container-instance.class';
import { AnyInjectIdentifier } from '../types/inject-identifier.type';
import { formatClassName } from '../utils/format-class-name';
import { resolveToTypeWrapper } from '../utils/resolve-to-type-wrapper.util';
import { ServiceMetadata } from '../interfaces/service-metadata.interface';

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * 
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 * 
 * @returns A decorator which is then used upon a class.
 */
export function Service (dependencies: AnyInjectIdentifier[]): ClassDecorator;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * 
 * @param options The options to use for initialisation of the service.
 * Documentation for the options can be found in ServiceOptions.
 * 
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 * 
 * @returns A decorator which is then used upon a class.
 */
export function Service<T = unknown>(options: Omit<ServiceOptions<T>, 'dependencies'>, dependencies: AnyInjectIdentifier[]): ClassDecorator;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * 
 * @param options The options to use for initialisation of the service.
 * Documentation for the options can be found in ServiceOptions.
 * The options must also contain the dependencies that the service requires.
 * 
 * If found, the specified dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 * 
 * @returns A decorator which is then used upon a class.
 */
export function Service (options: ServiceOptions<Constructable<unknown>> & { dependencies: AnyInjectIdentifier[] }): ClassDecorator;
export function Service<T>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyInjectIdentifier[], 
  maybeDependencies?: AnyInjectIdentifier[]
): ClassDecorator {
  return targetConstructor => {
    const { defaultContainer } = ContainerInstance;

    if (optionsOrDependencies == null) {
      // todo: more info in these error messages!!!
      throw new Error('The required configuration was not passed.');
    }

    /** A list of dependencies resolved from the arguments provided to the function. */
    let resolvedDependencies!: AnyInjectIdentifier[];

    if (Array.isArray(optionsOrDependencies)) {
      /** 
       * If our first argument is an array, then the user has not specified any options, 
       * and has instead filled the slot with a list of dependencies. 
       */
      resolvedDependencies = optionsOrDependencies;
    } else if (Array.isArray(maybeDependencies)) {
      /** 
       * Alternatively, they may have specified the dependencies as the last argument.
       * In that case, we'll try to map over the dependencies (if they exist.)
       */
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
      throw new Error('The dependencies provided were not able to be resolved.');
    }

    const wrappedDependencies = resolvedDependencies.map(resolveToTypeWrapper);

    /**
     * A default list of options for this service.
     * These are used when the options are not explicitly provided to the function.
     * However, if options are passed, these are merged in as defaults.
     */
    let metadata: Omit<ServiceMetadata<T>, 'dependencies'> & { container: ContainerInstance } = {
      id: targetConstructor,
      type: targetConstructor as unknown as Constructable<T>,
      multiple: false,
      eager: false,
      scope: 'container',
      value: EMPTY_VALUE,
      factory: undefined,
      container: defaultContainer
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
    if (container.has(id) && container.get(id) === targetConstructor) {
      throw new Error(`@Service() has been called twice upon ${formatClassName(targetConstructor)}, or you have used an ID twice.`);
    }

    /**
     * Check any available eager types immediately, so we can quickly raise an error
     * if they are invalid, instead of when the service is injected.
     */
    wrappedDependencies.forEach((wrapper, index) => {
      if (wrapper.isFactory) {
        return;
      }

      if (wrapper.eagerType !== null) {
        const type = typeof wrapper;

        if (type !== 'function' && type !== 'object' && type !== 'string') {
          throw new Error(
            `The identifier provided at index ${index} for service ${formatClassName(targetConstructor)} is invalid.`
          );
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
