/**
 * The injection scope of a given service within its container.
 * @public
 *
 * This tuple has three possible values:
 *   - `"singleton"`: The service always will be created in the default container regardless of who registering it
 *   - `"container"`: A scoped service will be created once when requested from the given container
 *   - `"transient"`: A new instance of the service will be created for each request.
 */
export type ContainerScope = 'singleton' | 'container' | 'transient';
