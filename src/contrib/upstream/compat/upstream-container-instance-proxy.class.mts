import { ContainerInstance as OurContainerInstance } from "../../../index.mjs";
import { ContainerIdentifier as UpstreamContainerIdentifier } from "../tree/src/types/container-identifier.type";
import { UpstreamContainerInstance, UpstreamContainerScope, UpstreamHandler, UpstreamServiceIdentifier, UpstreamServiceMetadata, UpstreamServiceOptions, UpstreamToken } from "../upstream.types";
import { ContainerRegistryStub } from "./upstream-container-registry-proxy.class.mjs";

/**
 * An internal map of {@link ContainerInstanceStub} instances to their
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
const ContainerInstanceStub = class ContainerInstance implements UpstreamContainerInstance {
    public readonly id: UpstreamContainerIdentifier;
    private metadataMap: Map<UpstreamServiceIdentifier, UpstreamServiceMetadata<unknown>> = new Map();
    private multiServiceIds: Map<UpstreamServiceIdentifier, { tokens: UpstreamToken<unknown>[]; scope: UpstreamContainerScope }> = new Map();
    private readonly handlers: UpstreamHandler[] = [ ];

    /** Not used by typestack's implementation, but kept for compatibility. */
    private disposed = false;

    public constructor (id: UpstreamContainerIdentifier) {
        this.id = id;

        ContainerRegistryStub.registerContainer(this);
        this.handlers = ContainerRegistryStub.defaultContainer?.handlers || [];
    }

    public has<T = unknown>(identifier: UpstreamServiceIdentifier<T>): boolean {
        return getHostIfExists(this)?.has(identifier) ?? this.multiServiceIds.has(identifier) || this.metadataMap.has(identifier);
    }

    public get<T = unknown>(identifier: UpstreamServiceIdentifier<T>): T {
        throw new Error("Method not implemented.");
    }
    public getMany<T = unknown>(identifier: UpstreamServiceIdentifier<T>): T[] {
        throw new Error("Method not implemented.");
    }
    public set<T = unknown>(serviceOptions: UpstreamServiceOptions<T>): this {
        throw new Error("Method not implemented.");
    }
    public remove(identifierOrIdentifierArray: UpstreamServiceIdentifier | UpstreamServiceIdentifier[]): this {
        throw new Error("Method not implemented.");
    }
    public of(containerId?: UpstreamContainerIdentifier): UpstreamContainerInstance {
        throw new Error("Method not implemented.");
    }
    public registerHandler(handler: UpstreamHandler<unknown>): UpstreamContainerInstance {
        throw new Error("Method not implemented.");
    }
    public import(services: Function[]): UpstreamContainerInstance {
        throw new Error("Method not implemented.");
    }
    public reset(options?: { strategy: "resetValue" | "resetServices"; }): this {
        throw new Error("Method not implemented.");
    }
    public dispose(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export function createContainerInstanceStub (host: OurContainerInstance, id?: UpstreamContainerIdentifier) {
    const stub = new ContainerInstanceStub(id ?? host.id);
    STUB_TO_HOST_CONTAINER_MAP.set(stub, host);

    return stub;
}

export function isContainerInstance

export { ContainerInstanceStub };