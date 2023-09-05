import { ServiceMetadata } from './service-metadata.interface.mjs';
import { AnyServiceDependency } from './service-dependency.interface.mjs';
import { RequireExactlyOne, SetRequired } from 'type-fest';

type OptionalKeys = 'type' | 'factory' | 'value';

type ServiceMetadataWithoutDeps<T> = Omit<ServiceMetadata<T>, 'dependencies'>;

/**
 * The public ServiceOptions is partial object of ServiceMetadata and either one
 * of the following is set: `type`, `factory`, `value` but not more than one.
 */
export type ServiceOptions<T = unknown> = Partial<RequireExactlyOne<ServiceMetadataWithoutDeps<T>, OptionalKeys>> &
  Partial<Omit<ServiceMetadataWithoutDeps<T>, OptionalKeys>> & { dependencies?: AnyServiceDependency[] };

export type ServiceOptionsWithDependencies<T = unknown> = ServiceOptions<T> &
  SetRequired<ServiceOptions<T>, 'dependencies'>;
export type ServiceOptionsWithoutDependencies<T = unknown> = Omit<ServiceOptions<T>, 'dependencies'>;

/**
 * A variant of {@link ServiceOptions} which does not contain either a class-based type member,
 * or a "dependencies" member.  This is used to make the declaration of static values easier.
 * @internal
 *
 * @see {@link Container.set}
 */
export type ServiceOptionsWithoutTypeOrDependencies<T = unknown> = Omit<ServiceOptions<T>, 'type' | 'dependencies'>;
