export { JSService } from './decorators/js-service.decorator.mjs';
export { Service } from './decorators/service.decorator.mjs';

export * from './error/cannot-instantiate-builtin-error.mjs';
export * from './error/cannot-instantiate-value.error.mjs';
export * from './error/service-not-found.error.mjs';

export { HostContainer } from './functions/host-container.function.mjs';
export { Lazy } from './functions/lazy.function.mjs';
export { Many, Optional, Self, SkipSelf } from './functions/resolution-constraints.functions.mjs';

export { ContainerResetOptions, ContainerResetStrategy } from './interfaces/container-reset-options.interface.mjs';
export {
  ContainerConflictDefinition,
  ContainerConflictStrategy,
  ContainerFreeStrategy,
  CreateContainerOptions,
} from './interfaces/create-container-options.interface.mjs';
export { DependencyDescriptor } from './interfaces/dependency-descriptor.interface.mjs';
export { ServiceMetadata } from './interfaces/service-metadata.interface.mjs';
export {
  AnyServiceDependency,
  DependencyPairWithConfiguration,
  ServiceDependencyOptions,
} from './interfaces/service-dependency.interface.mjs';
export { ServiceOptions } from './interfaces/service-options.interface.mjs';
export { ContainerTreeVisitor, VisitRetrievalOptions } from './interfaces/tree-visitor.interface.mjs';

export { Constructable } from './types/constructable.type.mjs';
export { ContainerIdentifier } from './types/container-identifier.type.mjs';
export { ContainerScope } from './types/container-scope.type.mjs';
export { ExtractToken } from './types/extract-token.type.mjs';
export { IdentifierScope } from './types/identifier-scope.type.mjs';
export { ServiceIdentifierLocation } from './types/service-identifier-location.type.mjs';
export { ServiceIdentifier } from './types/service-identifier.type.mjs';
export { ResolutionConstraintFlag, ResolutionConstraintsDescriptor } from './types/resolution-constraint.type.mjs';

export { ContainerInstance } from './container-instance.class.mjs';
export { Token } from './token.class.mjs';

/** We export the default container under the Container alias. */
export { defaultContainer as Container, defaultContainer as default } from './container-instance.class.mjs';
