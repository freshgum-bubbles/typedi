import { ServiceIdentifier } from "../../../../index.mjs";

// todo: add tsdoc to all of this

export interface TreeContainerRetrievalDescriptor {
    /** The time at which the retrieval was performed. */
    time: number;

    /** The key being retrieved. */
    key: ServiceIdentifier;
}
