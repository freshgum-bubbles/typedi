import { AnyServiceDependency } from '../interfaces/service-dependency.interface';
import { ServiceOptions } from '../interfaces/service-options.interface';
import { AnyConstructable } from '../types/any-constructable.type';
import { AnyInjectIdentifier } from '../types/inject-identifier.type';
import { Service } from './service.decorator';

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<T extends AnyConstructable>(dependencies: AnyServiceDependency[], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental
 *
 * @param options The options to use for initialisation of the service.
 * Documentation for the options can be found in ServiceOptions.
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<T extends AnyConstructable>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: AnyServiceDependency[],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental
 *
 * @param options The options to use for initialisation of the service.
 * Documentation for the options can be found in ServiceOptions.
 * The options must also contain the dependencies that the service requires.
 *
 * If found, the specified dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<T extends AnyConstructable>(
  options: ServiceOptions<T> & { dependencies: AnyServiceDependency[] },
  constructor: T
): T;

export function JSService<T extends AnyConstructable>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyServiceDependency[],
  dependenciesOrConstructor: AnyInjectIdentifier[] | T,
  maybeConstructor?: T
): T {
  let constructor!: T;

  if (typeof dependenciesOrConstructor === 'function') {
    // eslint-disable-next-line
    constructor = dependenciesOrConstructor as T;
    Service(optionsOrDependencies as ServiceOptions<T> & { dependencies: AnyInjectIdentifier[] })(constructor);
  } else if (maybeConstructor) {
    constructor = maybeConstructor;
    Service(optionsOrDependencies, dependenciesOrConstructor)(constructor);
  }

  if (!constructor) {
    throw Error('The JSService overload was not used correctly.');
  }

  return constructor;
}

export type JSService<T> = T extends AnyConstructable<infer U> ? U : never;
