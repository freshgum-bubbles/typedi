import { ServiceMetadata } from '../../../../index.mjs';

// todo: add tsdoc to all of this

export interface TreeServiceDescriptor<T = unknown> {
  readonly metadata: ServiceMetadata<T>;
}
