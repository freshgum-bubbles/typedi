/**
 * The location of a given service within the container hierarchy, from the
 * perspective of the container upon which the location retrieval was performed.
 * @internal
 *
 * @remarks
 * This is a constant enumerable.
 * As such, any references to it are inlined at compile-time.
 *
 * @example
 * Here is an example:
 * ```ts
 * const location: ServiceIdentifierLocation = Container.getIdentifierLocation('service-id');
 * ```
 */
export const enum ServiceIdentifierLocation {
  /**
   * The specified identifier was found directly in the context of the container.
   * Its container may have it, but due to its presence locally, the parent tree
   * has not been searched.
   *
   * @example
   * Here is an example of a local resolution:
   * ```ts
   * const NAME = new Token<string>();
   * Container.set(NAME, 'Joanna');
   *
   * Container.getIdentifierLocation(NAME);
   * // -> Local
   * ```
   */
  Local = 0,

  /**
   * The container was not able to find a definition for the identifier locally,
   * but its parent was.
   *
   * @remarks
   * In this context, it is important to remember that the use of the word "parent"
   * does not necessarily mean that the container's direct parent has it.
   * It could mean that the parent *does*, or that a container in the parent hierarchy
   * was able to resolve the identifier.
   *
   * @example
   * Here is an example where the direct parent of a container resolves the identifier:
   * ```ts
   * const NAME = new Token<string>();
   * const myContainer = Container.ofChild(Symbol());
   *
   * Container.set(NAME, 'Joanna');
   *
   * myContainer.getIdentifierLocation(NAME);
   * // -> Parent
   * ```
   *
   * @example
   * Here is an example where a container in the hierarchy chain resolve the identifier:
   * ```ts
   * const NAME = new Token<string>();
   *
   * // Create a child of the default container, and then create a child of that.
   * const myContainer = Container
   *   .ofChild(Symbol())
   *   .ofChild(Symbol());
   *
   * Container.set(NAME, 'Joanna');
   *
   * myContainer.getIdentifierLocation(NAME);
   * // -> Parent
   * ```
   */
  Parent,

  /**
   * The specified identifier could not be found in the context of the container,
   * or any container in the container's parent hierarchy.
   * 
   * @example
   * Here is an example wherein this value would be emitted:
   * ```ts
   * const NAME = new Token<string>();
   * 
   * Container.getIdentifierLocation(NAME);
   * // -> None
   * ```
   */
  None,
}
