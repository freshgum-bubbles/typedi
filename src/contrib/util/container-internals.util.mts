import { ContainerInstance } from "../../container-instance.class.mjs";

/** A helper to access private {@link ContainerInstance} methods. @ignore */
export type ContainerInternals = {
    metadataMap: ContainerInstance['metadataMap'];
    resolveConstrainedIdentifier: ContainerInstance['resolveConstrainedIdentifier'];
    resolveMultiID: ContainerInstance['resolveMultiID'];
};
