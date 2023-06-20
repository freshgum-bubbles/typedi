/** This is an internal package, so we don't re-export it on purpose. */
import { ContainerInstance } from './container-instance.class';

export { JSService } from './decorators/js-service.decorator';
export { Service } from './decorators/service.decorator';

export * from './error/cannot-instantiate-builtin-error';
export * from './error/cannot-instantiate-value.error';
export * from './error/service-not-found.error';

export { Lazy } from './functions/lazy.function';

export { ServiceMetadata } from './interfaces/service-metadata.interface';
export { ServiceOptions } from './interfaces/service-options.interface';

export { Constructable } from './types/constructable.type';
export { ContainerIdentifier } from './types/container-identifier.type';
export { ContainerScope } from './types/container-scope.type';
export { ServiceIdentifier } from './types/service-identifier.type';
export { LazyReference } from './types/lazy-reference.type';

export { ContainerInstance } from './container-instance.class';
export { Token } from './token.class';

/** We export the default container under the Container alias. */
export const Container = ContainerInstance.defaultContainer;
export default Container;
