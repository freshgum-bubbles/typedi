import { ServiceMetadata } from './service-metadata.interface';
import { AnyServiceDependency } from './service-dependency.interface';
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
