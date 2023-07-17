import { ServiceMetadata } from './service-metadata.interface';
import { AnyServiceDependency } from './service-dependency.interface';

/**
 * The public ServiceOptions is partial object of ServiceMetadata and either one
 * of the following is set: `type`, `factory`, `value` but not more than one.
 */
export type ServiceOptions<T = unknown> = (
  | (
    // THISISFINE: use type-fest RequireAtLeastOne
      | Omit<Partial<ServiceMetadata<T>>, 'type' | 'factory'>
      | Omit<Partial<ServiceMetadata<T>>, 'value' | 'factory'>
      | Omit<Partial<ServiceMetadata<T>>, 'value' | 'type'>
    )
  | Pick<Partial<ServiceMetadata<T>>, 'factory'>
) & { dependencies?: AnyServiceDependency[] };
