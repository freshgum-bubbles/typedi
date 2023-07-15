import { ServiceMetadata } from './service-metadata.interface';
import { AnyServiceDependency } from './service-dependency.interface';
import { RequireExactlyOne } from 'type-fest';

type OptionalKeys = 'type' | 'factory' | 'value';

/**
 * The public ServiceOptions is partial object of ServiceMetadata and either one
 * of the following is set: `type`, `factory`, `value` but not more than one.
 */
export type ServiceOptions<T = unknown> =
  Partial<RequireExactlyOne<ServiceMetadata<T>, OptionalKeys>> &
  Partial<Omit<ServiceMetadata<T>, OptionalKeys>> &
  { dependencies?: AnyServiceDependency[] };
