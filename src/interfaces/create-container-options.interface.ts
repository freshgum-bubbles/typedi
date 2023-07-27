// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ContainerInstance } from '../container-instance.class';

/**
 * @fileoverview
 * This file contains an interface for describing how the overall
 * container creation process should work.
 *
 * Containers are created through three methods:
 *   - {@link ContainerInstance.(of:static)}
 *   - {@link ContainerInstance.of}
 *   - {@link ContainerInstance.ofChild}
 *
 * In each, we don't currently have a way to describe
 * what to do if a container with the specified name already exists.
 * Consider the following example:
 * ```ts
 * ContainerInstance.of('my-container', null);
 * defaultContainer.ofChild('my-container');
 * ```
 *
 * In 0.3.22, the {@link ContainerInstance.ofChild} call actually
 * returns the instance of the *orphaned container*.
 *
 * This is *really* bad, as it means that, unless you use unique
 * symbols as container IDs, operations which you would *expect*
 * to work may fail in very unexpected ways.
 *
 * This is also present in other methods, such as {@link ContainerInstance.of}
 * and its static equivalent.
 *
 * If we look [upstream](https://github.com/typestack/typedi),
 * the "container inheritance rework" which sadly never emerged
 * suggested allowing a set of options to supplement the default
 * container creation behaviour.  One of those options was to
 * throw in the event of a container already existing.
 *
 * This isn't a suitable default either, as you'd have to carry
 * around references to your container everywhere.
 * Consider the following:
 * ```ts
 * defaultContainer.ofChild('known-name'); // works
 * defaultContainer.ofChild('known-name'); // fails
 * ```
 * Above, we're essentially utilising the container as a map of maps.
 * This is very convenient, as it means that we can essentially say:
 * "'Create' this, but I *know* it already exists."
 *
 * In this case, I'd say that the default behaviour doesn't do either.
 * For instance, wouldn't you want to be able to tell it to fail if
 * a container with that name *doesn't* exist? Perhaps your application
 * expects it to be created by central configuration code. In that
 * case, you'd definitely want it to fail.
 *
 * To hack a fix for the above, you *could* check {@link ContainerRegistry}
 * before every call to `ofChild`, but that seems hacky.
 * We can do better!
 *
 * So, to remedy the above, we're introducing container creation options.
 * This is done through {@link CreateContainerOptions}.
 * These can be passed to any of the 3 methods above (of, of & ofChild).
 *
 * They don't change any of the resolution logic inside, e.g.
 * {@link ContainerInstance.get} like the upstream implementation did,
 * but they give a *lot* more control over how TypeDI deals with certain situations
 * around when to create a container, and when not to.
 *
 * ## Implementation Note
 * In future, we may want to extend this to allow describing how the
 * container should resolve symbols.
 */

/**
 * A description of how TypeDI should react when a container
 * with the specified ID already exists in the registry.
 * @public
 *
 * There are three possible values:
 *   - `throw`: Throw an error upon conflict.
 *   - `null`: Return null.
 *   - `returnExisting`: Return the existing container.
 *
 * **If you pass a {@link ContainerConflictDefinition} without this,
 * it will default to `throw`.  Otherwise, `returnExisting` is the default.**
 *
 * @example
 * Review the following:
 * ```ts
 * ContainerInstance.of('my-container', defaultContainer, {
 *   onConflict: 'throw'
 * });
 * ```
 *
 * @remarks
 * Be aware that when `returnExisting` is used, you may encounter
 * unexpected errors if containers with completely different configurations
 * have the same ID. Therefore, it is discouraged in most situations.
 * *However, for historical reasons, it remains the default.*
 *
 * Consider the following example:
 * ```ts
 * ContainerInstance.of('my-container', null); // Create an orphaned container.
 * defaultContainer.ofChild('my-container'); // Create a child container.
 * ```
 * In the case of `returnExisting`, the call to {@link ContainerInstance.ofChild}
 * would return a reference to the orphaned container, which will cause unexpected
 * runtime errors when your code is unable to resolve symbols from the parent container.
 *
 * As such, when `returnExisting` is utilised, it is heavily recommended to use
 * unique symbol IDs that are unique to a certain part of your application.
 */
export type ContainerConflictStrategy = 'throw' | 'null' | 'returnExisting';

/**
 * A description of how TypeDI should react when a container
 * with the specified ID does not already exist in the registry.
 * @public
 *
 * There are three possible values:
 *   - `throw`: Throw an error.
 *   - `null`: Return null.
 *   - `returnNew`: Return a newly-created container instance. **This is the default.**
 *
 * @example
 * Here is an example:
 * ```ts
 * // When the container doesn't already exist...
 * assert(defaultContainer.ofChild(Symbol('my-unique-id'), { onFree: 'null' }) === null);
 *
 * // We can also 'returnNew' to use the default behaviour.
 * defaultContainer.ofChild(Symbol(), { onFree: 'returnNew' });
 *
 * // Or, we can throw if the container *should* already exist.
 * defaultContainer.ofChild(Symbol(), { onFree: 'throw' }); // Throws an error.
 * ```
 */
export type ContainerFreeStrategy = 'throw' | 'null' | 'returnNew';

/**
 * A definition of what constitutes a conflict in the case of a pre-existing container
 * with the same ID as the one passed to a container creation method.
 * @public
 *
 * There are two possible values:
 *   - `rejectAll`: If a container already exists, immediately reject it. **This is the default.**
 *   - `allowSameParent`: Allow a container if it has the same parent as the one provided.
 */
export type ContainerConflictDefinition = 'rejectAll' | 'allowSameParent';

/**
 * A set of options to supplement the container creation process.
 * @public
 * 
 * @see {@link ContainerInstance.of}
 * @see {@link ContainerInstance.ofChild}
 */
export interface CreateContainerOptions {
  /**
   * A description of how TypeDI should react when a container
   * with the specified ID already exists in the registry.
   *
   * @see {@link ContainerConflictStrategy}
   */
  onConflict?: ContainerConflictStrategy;

  /**
   * A description of how TypeDI should react when a container
   * with the specified ID does not already exist in the registry.
   *
   * @see {@link ContainerFreeStrategy}
   */
  onFree?: ContainerFreeStrategy;

  /**
   * A description of what constitutes a conflict in the case of a pre-existing container
   * with the same ID as the one passed to a container creation method.
   *
   * @see {@link ContainerConflictDefinition}
   */
  conflictDefinition?: ContainerConflictDefinition;
}
