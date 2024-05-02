import {
    UpstreamContainerIdentifier,
    UpstreamContainerInstance,
    UpstreamContainerRegistry
 } from "../upstream.types";
import { ContainerInstanceStub } from "./upstream-container-instance-proxy.class.mjs";

const ContainerRegistryStub = class ContainerRegistry implements UpstreamContainerRegistry {
    private static readonly containerMap: Map<UpstreamContainerIdentifier, UpstreamContainerInstance> = new Map();
    public static readonly defaultContainer = new ContainerInstanceStub('default');

    public static registerContainer(container: UpstreamContainerInstance): void {
        if (container instanceof ContainerInstanceStub === false) {
            throw new Error('Only ContainerInstance instances can be registered.');
          }

          if (!ContainerRegistryStub.defaultContainer && container.id === 'default') {
            throw new Error('You cannot register a container with the "default" ID.');
          }

          if (ContainerRegistryStub.containerMap.has(container.id)) {
            throw new Error('Cannot register container with same ID.');
          }

          ContainerRegistryStub.containerMap.set(container.id, container);
    }
}

export { ContainerRegistryStub };