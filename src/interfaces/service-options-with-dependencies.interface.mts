import { PickRequired } from '../types/pick-required.type.mts';
import { ServiceOptions } from './service-options.interface.mts';

/**
 * A variant of {@link ServiceOptions} with the dependencies property required.
 *
 * @see {@link ServiceOptions}
 */
export type ServiceOptionsWithDependencies<T> = PickRequired<ServiceOptions<T>, 'dependencies'>;
