import { NativeError } from '../constants/minification/native-error.const.mjs';
import { AnyServiceDependency } from '../interfaces/service-dependency.interface.mjs';
import {
  ServiceOptions,
  ServiceOptionsWithDependencies,
  ServiceOptionsWithoutDependencies,
} from '../interfaces/service-options.interface.mjs';
import { AnyConstructable } from '../types/any-constructable.type.mjs';
import { Constructable } from '../types/constructable.type.mjs';
import { AnyInjectIdentifier } from '../types/inject-identifier.type.mjs';
import { Service } from './service.decorator.mjs';

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

export function JSService<T extends Constructable<unknown>>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyServiceDependency[],
  dependenciesOrConstructor: AnyInjectIdentifier[] | T,
  maybeConstructor?: T
): T {
  let constructor!: T;

  if (typeof dependenciesOrConstructor === 'function') {
    // eslint-disable-next-line
    constructor = dependenciesOrConstructor as T;
    Service(optionsOrDependencies as ServiceOptionsWithDependencies<T>)(constructor);
  } else if (maybeConstructor) {
    constructor = maybeConstructor;
    Service(optionsOrDependencies as ServiceOptionsWithoutDependencies<T>, dependenciesOrConstructor)(constructor);
  }

  if (!constructor) {
    throw NativeError('The JSService overload was not used correctly.');
  }

  return constructor;
}

export type JSService<T> = T extends AnyConstructable<infer U> ? U : never;
