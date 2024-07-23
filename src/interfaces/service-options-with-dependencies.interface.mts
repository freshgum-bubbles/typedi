/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { SetRequired } from 'type-fest';
import { ServiceOptions } from './service-options.interface.mjs';

/**
 * A variant of {@link ServiceOptions} with the dependencies property required.
 *
 * @see {@link ServiceOptions}
 */
export type ServiceOptionsWithDependencies<T> = SetRequired<ServiceOptions<T>, 'dependencies'>;
