import { ContainerInstance as OurContainerInstance } from "../../../index.mjs";
import { ContainerIdentifier as UpstreamContainerIdentifier } from "../tree/src/types/container-identifier.type";
import { UpstreamConstructable, UpstreamContainerInstance, UpstreamServiceIdentifier, UpstreamServiceMetadata, UpstreamToken } from "../upstream.types";

/**
 * An internal map of {@link ContainerInstanceProxy} instances to their
 * respective host {@link OurContainerInstance} objects.
 *
 * It should be noted that the {@link OurContainerInstance} instances are not direct
 * references to the host container; instead, they are intermediary containers that
 * are then children of the respective host containers.
 *
 * If a container is created via `new`, the first method call on that container
 * shall set the respective host in this map to `null` -- in this mode, the stub
 * shall operate independently as documented.
 */
const STUB_TO_HOST_CONTAINER_MAP: WeakMap<UpstreamContainerInstance, OurContainerInstance> = new WeakMap();

/**
 * Find the host of the {@link ContainerInstanceProxy}, if it exists.
 *
 * @returns The host, or `null` if one doesn't exist.
 */
function getHostIfExists (stub: UpstreamContainerInstance) {
    return STUB_TO_HOST_CONTAINER_MAP.get(stub) ?? null;
}

// for typestack container proxy, make a custom ContainerInstance (++) class which acts as a proxy (child) for the host container
// lets you use the metadataMap without custom Map class, usual ++ inheritance as codebases are not that different

/**
 * An implementation of a proxy which acts identically to the `ContainerInstance` class
 * found in the upstream `typestack/typedi` project.
 *
 * The construction of this class *is* allowed for 1:1 compatibility, though doing this
 * means that the container shall operate independently, and therefore not as a proxy.
 *
 * @remarks
 * The name of this class remains identical to upstream, as changing it may cause
 * unintented compatibility issues.
 */
const ContainerInstanceProxy = class ContainerInstance implements UpstreamContainerInstance {
    constructor (public readonly id: string) { }

    // For the purpose of maximal backwards compatibility, we're also going to implement private Container methods.
    private services: UpstreamServiceMetadata<unknown>[] = [ ];

    has<T>(type: UpstreamConstructable<T>): boolean;
    has<T>(id: string): boolean;
    has<T>(id: UpstreamToken<T>): boolean;
    has<T>(identifier: UpstreamServiceIdentifier): boolean {
      return !!this.findService(identifier);
    }


}

export function createContainerInstanceProxy (host: OurContainerInstance, id?: UpstreamContainerIdentifier) {
    const stub = new ContainerInstanceProxy(id ?? host.id);
    STUB_TO_HOST_CONTAINER_MAP.set(stub, host);

    return stub;
}

export { ContainerInstanceProxy as ContainerInstanceStub };