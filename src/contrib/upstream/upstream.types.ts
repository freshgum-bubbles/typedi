// .
export { ContainerRegistry as UpstreamContainerRegistry } from './tree/src/container-registry.class';
export { EMPTY_VALUE as UPSTREAM_EMPTY_VALUE } from './tree/src/empty.const';

// ./index
export {
  CannotInjectValueError as UpstreamCannotInjectValueError,
  CannotInstantiateValueError as UpstreamCannotInstantiateValueError,
  Constructable as UpstreamConstructable,
  Container as UpstreamContainer,
  ContainerInstance as UpstreamContainerInstance,
  Handler as UpstreamHandler,
  Inject as UpstreamInject,
  InjectMany as UpstreamInjectMany,
  Service as UpstreamService,
  ServiceIdentifier as UpstreamServiceIdentifier,
  ServiceMetadata as UpstreamServiceMetadata,
  ServiceNotFoundError as UpstreamServiceNotFoundError,
  ServiceOptions as UpstreamServiceOptions,
  Token as UpstreamToken,
} from './tree/src/index';

// ./interfaces/
export { ContainerOptions as UpstreamContainerOptions } from './tree/src/interfaces/container-options.interface';
export { AbstractConstructable as UpstreamAbstractConstructable } from './tree/src/types/abstract-constructable.type';
export { ContainerIdentifier as UpstreamContainerIdentifier } from './tree/src/types/container-identifier.type';
export { ContainerScope as UpstreamContainerScope } from './tree/src/types/container-scope.type';
