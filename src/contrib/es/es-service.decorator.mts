import { AnyServiceDependency, ServiceOptions, Constructable, Service } from '../../index.mjs';
import {
  ServiceOptionsWithDependencies,
  ServiceOptionsWithoutDependencies,
} from '../../interfaces/service-options.interface.mjs';
import { ESClassDecorator } from '../util/es-class-decorator.type.mjs';

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This is a TypeScript decorator.**
 *
 * @example
 * Here is an example:
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
export function ESService<T = unknown>(dependencies: AnyServiceDependency[]): ESClassDecorator<Constructable<T>>;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This is a TypeScript decorator.**
 *
 * @example
 * Here is an example:
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
export function ESService<T = unknown>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: AnyServiceDependency[]
): ESClassDecorator<Constructable<T>>;

/**
 * Marks class as a service that can be injected using Container.
 * The options allow customization of how the service is injected.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This is a TypeScript decorator.**
 *
 * @example
 * Here is an example:
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
export function ESService<T = unknown>(
  options: ServiceOptionsWithDependencies<Constructable<unknown>>
): ESClassDecorator<Constructable<T>>;
export function ESService<T = unknown>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyServiceDependency[],
  maybeDependencies?: AnyServiceDependency[]
): ESClassDecorator<Constructable<T>> {
  return (target: Constructable<T>, context: ClassDecoratorContext) => {
    if (context.kind !== 'class') {
      throw new Error('@ESService() must only be used to decorate classes.');
    }

    Service(
      optionsOrDependencies as ServiceOptionsWithoutDependencies<T>,
      maybeDependencies as AnyServiceDependency[]
    )(target);
  };
}
