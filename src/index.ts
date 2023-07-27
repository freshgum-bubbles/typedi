/**
 * _Elegant Dependency Injection in JavaScript and TypeScript._
 * 
 * @remarks
 * This API is somewhat similar to [typestack/typedi](https://github.com/typestack/typedi),
 * though additional functionality and breaking changes have been introduced to ease usage
 * of the overall library in broader applications.
 * 
 * Some examples of this include:
 *   - The introduction of resolution constraints.
 *   - Removal of Reflect Metadata-based API, with a more robust static variant.
 *   - Improvements to {@link ContainerInstance} to improve performance.
 *   - Custom error classes, such as {@link ContainerRegistryError},
 *     to allow for more easy-to-understand error messages and types.
 *   - System tokens, such as {@link HostContainer}, which provide additional
 *     functionality to services in a safe, strict-typed manner.
 * 
 * Further examples of this are noted on the main documentation website.
 * 
 * @packageDocumentation
 */

export { JSService } from './decorators/js-service.decorator';
export { Service } from './decorators/service.decorator';

export * from './error/cannot-instantiate-builtin-error';
export * from './error/cannot-instantiate-value.error';
export * from './error/container-registry-error.error';
export * from './error/service-not-found.error';

export { HostContainer } from './functions/host-container.function';
export { Lazy } from './functions/lazy.function';
export { Many, Optional, Self, SkipSelf } from './functions/resolution-constraints.functions';

export { ContainerResetOptions, ContainerResetStrategy } from './interfaces/container-reset-options.interface';
export {
  ContainerConflictDefinition,
  ContainerConflictStrategy,
  ContainerFreeStrategy,
  CreateContainerOptions,
} from './interfaces/create-container-options.interface';
export { ServiceMetadata } from './interfaces/service-metadata.interface';
export {
  AnyServiceDependency,
  DependencyPairWithConfiguration,
  ServiceDependencyOptions,
} from './interfaces/service-dependency.interface';
export { ServiceOptions } from './interfaces/service-options.interface';
export { ContainerTreeVisitor, VisitRetrievalOptions } from './interfaces/tree-visitor.interface';

export { Constructable } from './types/constructable.type';
export { ContainerIdentifier } from './types/container-identifier.type';
export { ContainerScope } from './types/container-scope.type';
export { ExtractToken } from './types/extract-token.type';
export { ServiceIdentifier } from './types/service-identifier.type';
export { LazyReference } from './types/lazy-reference.type';
export { ResolutionConstraintFlag, ResolutionConstraintsDescriptor } from './types/resolution-constraint.type';

export { ContainerInstance } from './container-instance.class';
export { Token } from './token.class';

/** We export the default container under the Container alias. */
export { defaultContainer as Container, defaultContainer as default, ServiceIdentifierLocation } from './container-instance.class';
