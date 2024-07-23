/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ContainerInstance } from '../container-instance.class.mjs';
import { CreateContainerOptions } from '../interfaces/create-container-options.interface.mjs';

export type CreateContainerResult<T extends CreateContainerOptions> = T['onConflict'] extends 'null'
  ? null | ContainerInstance
  : T['onFree'] extends 'null'
  ? null | ContainerInstance
  : ContainerInstance;
