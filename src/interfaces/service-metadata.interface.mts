import { ContainerInstance } from '../container-instance.class.mts';
import { Constructable } from '../types/constructable.type.mts';
import { ContainerScope } from '../types/container-scope.type.mts';
import { ServiceFactory } from '../types/service-factory.type.mts';
import { ServiceIdentifier } from '../types/service-identifier.type.mts';
import { Resolvable } from './resolvable.interface.mts';

/**
 * Service metadata is used to initialize service and store its state.
 */
export interface ServiceMetadata<Type = unknown> {
  /** Unique identifier of the referenced service. */
  id: ServiceIdentifier;

  /**
   * The injection scope for the service.
   *   - a `singleton` service always will be created in the default container regardless of who registering it
   *   - a `container` scoped service will be created once when requested from the given container
   *   - a `transient` service will be created each time it is requested
   */
  scope: ContainerScope;

  /**
   * Class definition of the service what is used to initialize given service.
   * This property maybe null if the value of the service is set manually.
   * If id is not set then it serves as service id.
   */
  type: Constructable<Type> | null;

  /**
   * Factory function used to initialize this service.
   * Can be regular function ("createCar" for example),
   * or other service which produces this instance ([CarFactory, "createCar"] for example).
   *
   * If any dependencies were declared, these are passed to the factory.
   *
   * @see {@link ServiceFactory}
   */
  factory?: [factoryClass: Constructable<unknown>, methodName: string] | ServiceFactory;

  /**
   * Instance of the target class.
   */
  value: unknown | Symbol;

  /**
   * Allows to setup multiple instances the different classes under a single service id string or token.
   */
  multiple: boolean;

  /**
   * Indicates whether a new instance should be created as soon as the class is registered.
   * By default the registered classes are only instantiated when they are requested from the container.
   *
   * @remarks
   * **Usage of this option is discouraged**, as it makes code harder to test and more complex to understand.
   * In the context of something like a database service, it may be wiser to provide an initializer method
   * which can then be called from your root service.
   *
   * _Note: This option is ignored for transient services._
   */
  eager: boolean;

  // todo: if we use TypeWrapper here, expose it publicly?
  /**
   * The dependencies of the service's constructor.
   * These are wrapped objects.
   */
  dependencies: Resolvable[];

  /**
   * Optionally, a container to register the service under.
   * By default, this is the global container.
   */
  container?: ContainerInstance;
}
