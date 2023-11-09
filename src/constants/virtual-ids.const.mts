import { ServiceIdentifier } from "../index.mjs";
import { HOST_CONTAINER } from "./host-container.const.mjs";

/**
 * A list of IDs which, when passed to `.has`, always return true.
 *
 * This is used to facilitate the implementation of virtual tokens such as
 * HostContainer which are not actually present in the container.
 *
 * In these situations, returning `false` on a .has check would not be spec-compliant,
 * and would expose internal implementation details regarding the container.
 */
export const VIRTUAL_IDENTIFIERS: ServiceIdentifier[] = [
    /**
     * Provide compatibility with the `HostContainer()` API.
     */
    HOST_CONTAINER,
];
