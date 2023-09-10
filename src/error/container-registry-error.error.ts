// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ContainerRegistry } from "../container-registry.class";

/**
 * An error thrown from operations within the {@link ContainerRegistry}.
 *
 * @group Errors
 *
 * @see {@link ContainerRegistry}
 */
export class ContainerRegistryError extends Error {
  readonly name = 'ContainerRegistryError';
}
