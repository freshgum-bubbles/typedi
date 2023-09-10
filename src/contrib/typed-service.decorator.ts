/* eslint-disable @typescript-eslint/no-unused-vars -- The T overload is used to keep compatibility with other overloads. */
import { Service } from '../decorators/service.decorator';
import { AnyServiceDependency } from '../interfaces/service-dependency.interface';
import { ServiceOptions } from '../interfaces/service-options.interface';
import { ServiceWithDependencies } from '../types/typed-dependencies.type';

/**
 * Marks class as a service that can be injected using Container.
 * Uses the default options, wherein the class can be passed to `.get` and an instance of it will be returned.
 * By default, the service shall be registered upon the `defaultContainer` container.
 *
 * @remarks
 * **This is a TypeScript decorator.**
 *
 * @example
 * ```ts
 * @TypedService([ ])
 * class OtherService { }
 *
 * @TypedService([OtherService])
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
export function TypedService<T, TDependencies extends readonly AnyServiceDependency[]>(
  dependencies: TDependencies
): (subject: ServiceWithDependencies<TDependencies>) => void;

export function TypedService<T, TDependencies extends readonly AnyServiceDependency[]>(
  options: Omit<ServiceOptions<T>, 'dependencies'>,
  dependencies: TDependencies
): (subject: ServiceWithDependencies<TDependencies>) => void;

export function TypedService<T, TDependencies extends readonly AnyServiceDependency[]>(
  options: Omit<ServiceOptions<T>, 'dependencies'> & { dependencies: TDependencies }
): (subject: ServiceWithDependencies<TDependencies>) => void;

export function TypedService<T, TDependencies extends readonly AnyServiceDependency[]>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | TDependencies,
  maybeDependencies?: TDependencies
) {
  /**
   * Type the function call to fit one of its overloads to suppress type errors.
   *
   * Note that unlike {@link JSService}, we do no error-checking of the arguments here.
   * In the context of typed dependencies, this would be impossible -- we have no way
   * of verifying the validity of the types at runtime.
   */
  return Service(
    optionsOrDependencies as unknown as Omit<ServiceOptions<T>, 'dependencies'>,
    maybeDependencies as never
  );
}
