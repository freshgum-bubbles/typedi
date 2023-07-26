import { ContainerInstance } from './container-instance.class';
import { ContainerRegistryError } from './error/container-registry-error.error';
import { ContainerIdentifier } from './types/container-identifier.type';

/**
 * The container registry is responsible for holding the default and every
 * created container instance for later access.
 * @public
 */
export class ContainerRegistry {
  /**
   * The list of all known container. Created containers are automatically added
   * to this list. Two container cannot be registered with the same ID.
   * @internal
   *
   * This map doesn't contains the default container.
   */
  private static readonly containerMap: Map<ContainerIdentifier, ContainerInstance> = new Map();

  /**
   * Registers the given container instance or throws an error.
   *
   * _Note: This function is auto-called when a Container instance is created,
   * it doesn't need to be called manually!_
   *
   * @param container - the container to add to the registry
   *
   * @throws ContainerRegistryError
   * This exception is thrown in the following scenarios:
   *   - If the item being registered is not a container.
   *   - A container with the same ID already exists in the registry.
   */
  public static registerContainer(container: ContainerInstance): void {
    if (container instanceof ContainerInstance === false) {
      throw new ContainerRegistryError('Only ContainerInstance instances can be registered.');
    }

    if (ContainerRegistry.containerMap.has(container.id)) {
      throw new ContainerRegistryError('Cannot register container with same ID.');
    }

    ContainerRegistry.containerMap.set(container.id, container);
  }

  /**
   * Returns true if a container exists with the given ID or false otherwise.
   *
   * @param container - the ID of the container
   *
   * @returns Whether a container with the specified ID could be
   * found in the registry.
   */
  public static hasContainer(id: ContainerIdentifier): boolean {
    return ContainerRegistry.containerMap.has(id);
  }

  /**
   * Returns the container for requested ID or throws an error if no container
   * is registered with the given ID.
   *
   * @param container - the ID of the container
   *
   * @throws ContainerRegistryError
   * This exception is thrown when a container with
   * the given ID does not exist in the registry.
   */
  public static getContainer(id: ContainerIdentifier): ContainerInstance {
    const registeredContainer = this.containerMap.get(id);

    if (registeredContainer === undefined) {
      throw new ContainerRegistryError('No container is registered with the given ID.');
    }

    return registeredContainer;
  }

  /**
   * Removes the given container from the registry and disposes all services
   * registered only in this container.
   *
   * This function throws an error if no
   *   - container exists with the given ID
   *   - any of the registered services threw an error during it's disposal
   *
   * @param container - the container to remove from the registry
   *
   * @throws ContainerRegistryError
   * This exception is thrown when a container with
   * the specified ID does not exist in the registry.
   *
   * @throws Error
   *
   */
  public static async removeContainer(container: ContainerInstance): Promise<void> {
    const registeredContainer = ContainerRegistry.containerMap.get(container.id);

    if (registeredContainer === undefined) {
      throw new ContainerRegistryError('No container is registered with the given ID.');
    }

    /** We remove the container first. */
    ContainerRegistry.containerMap.delete(container.id);

    /** We dispose all registered classes in the container. */
    await registeredContainer.dispose();
  }
}
