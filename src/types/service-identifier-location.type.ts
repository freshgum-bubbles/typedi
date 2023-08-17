/**
 * The location of a given service within the container hierarchy, from the
 * perspective of the container upon which the location retrieval was performed.
 * @internal
 * 
 * ## {@link ServiceIdentifierLocation.Local | Local}
 * 
 * In the context of a given container, "local" denotes that the specified
 * identifier can be resolved inside said container, without any hierarchical
 * lookups in the container's parent chain.
 * 
 * ## {@link ServiceIdentifierLocation.Parent | Parent}
 * 
 * This symbol denotes that the container was not able to find a definition
 * for the identifier locally, but its parent was.  In this context, it is
 * important to remember that the use of the word "parent" does not necessarily
 * mean that the container's direct parent has it -- in fact, it may mean...
 * 
 *   1. The parent was able to resolve the identifier directly.
 *   2. The parent searched its parent, and continued until the identifier
 *      was found in the hierarchical tree of parents.
 * 
 * ## {@link ServiceIdentifierLocation.None | None}
 * 
 * This symbol denotes that the specified identifier could not be found in the
 * context of a given container.  If that container has a parent, this means
 * that its parent (or its parent, etc.) was not able to find the identifier.
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
    Local = 0,
    Parent,
    None,
}
