import { ContainerInstance } from "../index.mjs";

/**
 * A collection of private methods which are part of {@link ContainerInstance}.
 * This should be kept up-to-date with any internal Container API changes.
 *
 * @internal
 */
export interface ContainerInternals {
    resolveConstrainedIdentifier: ContainerInstance['resolveConstrainedIdentifier'];
}
