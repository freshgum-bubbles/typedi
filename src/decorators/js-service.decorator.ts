import { AnyServiceDependency } from '../interfaces/service-dependency.interface';
import {
  ServiceOptions,
  ServiceOptionsWithDependencies,
  ServiceOptionsWithoutDependencies,
} from '../interfaces/service-options.interface';
import { AnyConstructable } from '../types/any-constructable.type';
import { Constructable } from '../types/constructable.type';
import { AnyInjectIdentifier } from '../types/inject-identifier.type';
import { ServiceSubject } from '../types/service-subject.type';
import { Service } from './service.decorator';

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<T extends ServiceSubject<unknown, [TDep1]>, TDep1 extends AnyServiceDependency>(
  dependencies: [TDep1],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency,
  TDep8 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency,
  TDep8 extends AnyServiceDependency,
  TDep9 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
 *
 * @param dependencies The dependencies to provide upon initialisation of this service.
 * These will be provided to the service as arguments to its constructor.
 * They must be valid identifiers in the container the service shall be executed under.
 *
 * @param constructor The constructor of the service to inject.
 *
 * @returns The constructor.
 */
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9, TDep10]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency,
  TDep8 extends AnyServiceDependency,
  TDep9 extends AnyServiceDependency,
  TDep10 extends AnyServiceDependency
>(dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9, TDep10], constructor: T): T;

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
 * @experimental @ignore
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
export function JSService<T extends ServiceSubject<unknown, [TDep1]>, TDep1 extends AnyServiceDependency>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency
>(options: Omit<ServiceOptions<T>, 'dependencies'>, dependencies: [TDep1, TDep2], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency
>(options: Omit<ServiceOptions<T>, 'dependencies'>, dependencies: [TDep1, TDep2, TDep3], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency
>(options: Omit<ServiceOptions<T>, 'dependencies'>, dependencies: [TDep1, TDep2, TDep3, TDep4], constructor: T): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency
>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency
>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency
>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency,
  TDep8 extends AnyServiceDependency
>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency,
  TDep8 extends AnyServiceDependency,
  TDep9 extends AnyServiceDependency
>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9],
  constructor: T
): T;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 * @experimental @ignore
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
export function JSService<
  T extends ServiceSubject<unknown, [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9, TDep10]>,
  TDep1 extends AnyServiceDependency,
  TDep2 extends AnyServiceDependency,
  TDep3 extends AnyServiceDependency,
  TDep4 extends AnyServiceDependency,
  TDep5 extends AnyServiceDependency,
  TDep6 extends AnyServiceDependency,
  TDep7 extends AnyServiceDependency,
  TDep8 extends AnyServiceDependency,
  TDep9 extends AnyServiceDependency,
  TDep10 extends AnyServiceDependency
>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: [TDep1, TDep2, TDep3, TDep4, TDep5, TDep6, TDep7, TDep8, TDep9, TDep10],
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
    throw Error('The JSService overload was not used correctly.');
  }

  return constructor;
}

export type JSService<T> = T extends AnyConstructable<infer U> ? U : never;
