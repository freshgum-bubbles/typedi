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
