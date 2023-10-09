import { ServiceIdentifier } from "../../../../index.mjs";

// todo: add tsdoc to all of this

export interface TreeContainerRetrievalDescriptor {
    /** The time at which the retrieval was performed. */
    readonly time: number;

    /** The key being retrieved. */
    readonly key: ServiceIdentifier;
}
