import { SetRequired } from 'type-fest';
import { ServiceOptions } from './service-options.interface.mjs';

/**
 * A variant of {@link ServiceOptions} with the dependencies property required.
 *
 * @see {@link ServiceOptions}
 */
export type ServiceOptionsWithDependencies<T> = SetRequired<ServiceOptions<T>, 'dependencies'>;
