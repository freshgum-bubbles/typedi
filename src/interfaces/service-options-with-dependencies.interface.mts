import { PickRequired } from '../types/pick-required.type.mjs';
import { ServiceOptions } from './service-options.interface.mjs';

/**
 * A variant of {@link ServiceOptions} with the dependencies property required.
 *
 * @see {@link ServiceOptions}
 */
export type ServiceOptionsWithDependencies<T> = PickRequired<ServiceOptions<T>, 'dependencies'>;
