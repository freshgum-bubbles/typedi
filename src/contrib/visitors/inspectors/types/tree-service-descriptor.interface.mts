import { ServiceIdentifier } from "../../../../index.mjs"

// todo: add tsdoc to all of this

export interface TreeServiceDescriptor<T = unknown> {
    readonly identifier: ServiceIdentifier;
    readonly value: T;
}
