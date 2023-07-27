import { ContainerInstance } from '../container-instance.class';
import { Constructable } from '../types/constructable.type';
import { ContainerScope } from '../types/container-scope.type';
import { ServiceIdentifier } from '../types/service-identifier.type';
import { Resolvable } from './resolvable.interface';

/**
 * Service metadata is used to initialize service and store its state.
 */
export interface ServiceMetadata<Type = unknown> {
  /** Unique identifier of the referenced service. */
  id: ServiceIdentifier;

  /**
   * The injection scope of a given service within its container.
   * 
   * @see {@link ContainerScope}
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
   */
  factory: [Constructable<unknown>, string] | CallableFunction | undefined;

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
