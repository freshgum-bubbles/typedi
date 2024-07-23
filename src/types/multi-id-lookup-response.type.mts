/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ManyServicesMetadata } from '../interfaces/many-services-metadata.interface.mjs';
import { ServiceIdentifierLocation } from './service-identifier-location.type.mjs';

export type MultiIDLookupResponse =
  | [location: ServiceIdentifierLocation.None, idMap: null]
  | [location: ServiceIdentifierLocation.Local, idMap: ManyServicesMetadata]
  | [location: ServiceIdentifierLocation.Parent, idMap: ManyServicesMetadata];
