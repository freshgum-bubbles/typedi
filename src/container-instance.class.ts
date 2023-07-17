import { ContainerRegistry } from './container-registry.class';
import { ServiceNotFoundError } from './error/service-not-found.error';
import { CannotInstantiateValueError } from './error/cannot-instantiate-value.error';
import { Token } from './token.class';
import { Constructable } from './types/constructable.type';
import { ServiceIdentifier } from './types/service-identifier.type';
import { ServiceMetadata } from './interfaces/service-metadata.interface';
import { ServiceOptions, ServiceOptionsWithDependencies } from './interfaces/service-options.interface';
import { EMPTY_VALUE } from './constants/empty.const';
import { ContainerIdentifier } from './types/container-identifier.type';
import { ContainerScope } from './types/container-scope.type';
import { GenericTypeWrapper, TypeWrapper } from './types/type-wrapper.type';
import { Disposable } from './types/disposable.type';
import { BUILT_INS } from './constants/builtins.const';
import { CannotInstantiateBuiltInError } from './error/cannot-instantiate-builtin-error';
import { SERVICE_METADATA_DEFAULTS } from './constants/service-defaults.const';
import { Resolvable } from './interfaces/resolvable.interface';
import { wrapDependencyAsResolvable } from './utils/wrap-resolvable-dependency';
import { ResolutionConstraintFlag } from './types/resolution-constraint.type';
import { HOST_CONTAINER } from './constants/host-container.const';
import { ContainerResetOptions, ContainerResetStrategy } from './interfaces/container-reset-options.interface';
import { ContainerTreeVisitor } from './interfaces/tree-visitor.interface';
import { VisitorCollection } from './visitor-collection.class';
import { CreateContainerOptions } from './interfaces/create-container-options.interface';
import { CreateContainerResult } from './types/create-container-result.type';

/**
 * A static variable containing "throwIfDisposed".
 *
 * @example
 * ```ts
 * this[THROW_IF_DISPOSED]();
 * ```
 *
 * This is done instead of:
 *
 * ```ts
 * this.throwIfDisposed();
 * ```
 *
 * The former version reduces the bundle size, as the variable name can be mangled safely.
 */
const THROW_IF_DISPOSED = 'throwIfDisposed';

export const enum ServiceIdentifierLocation {
  Local = 'local',
  Parent = 'parent',
  None = 'none',
}

interface ManyServicesMetadata {
  tokens: Token<unknown>[];
  scope: ContainerScope;
}

/**
 * A list of IDs which, when passed to `.has`, always return true.
 *
 * This is used to facilitate the implementation of virtual tokens such as
 * HostContainer which are not actually present in the container.
 *
 * In these situations, returning `false` on a .has check would not be spec-compliant,
 * and would expose internal implementation details regarding the container.
 */
const ALWAYS_RESOLVABLE: ServiceIdentifier[] = [
  /**
   * Provide compatibility with the `HostContainer()` API.
   */
  HOST_CONTAINER,
];

/**
 * An instance of a TypeDI container.
 *
 * A container allows you to get, set, and modify dependencies in-place.
 * You can also attach individual services to a container, using them
 * to store services for later execution.
 *
 * @example
 * ```ts
 * const container = defaultContainer.ofChild('my-new-container');
 *
 * @Service({ container })
 * class MyService { }
 * ```
 */
export class ContainerInstance implements Disposable {
  /** The ID of this container. This will always be unique. */
  public readonly id!: ContainerIdentifier;

  /** Metadata for all registered services in this container. */
  private readonly metadataMap: Map<ServiceIdentifier, ServiceMetadata<unknown>> = new Map();

  /**
   * Services registered with 'multiple: true' are saved as simple services
   * with a generated token and the mapping between the original ID and the
   * generated one is stored here. This is handled like this to allow simplifying
   * the inner workings of the service instance.
   */
  private readonly multiServiceIds: Map<ServiceIdentifier, ManyServicesMetadata> = new Map();

  /**
   * Indicates if the container has been disposed or not.
   * Any function call should fail when called after being disposed.
   */
  public readonly disposed: boolean = false;

  /**
   * The default global container. By default services are registered into this
   * container when registered via `Container.set()` or `@Service` decorator.
   */
  public static readonly defaultContainer = new ContainerInstance('default');

  /**
   * The currently-present visitors attached to the container.
   * These are conjoined into a container of individual visitors,
   * which implements the standard ContainerTreeVisitor interface,
   * and individual listeners can be added and removed at will.
   *
   * @see {@link ContainerTreeVisitor}
   * @see {@link VisitorCollection}
   */
  private visitor = new VisitorCollection();

  /**
   * Whether the container is currently retrieving an identifier
   * which visitors should not be notified of.
   *
   * This is used to prevent {@link ContainerInstance.getManyOrNull}
   * from notifying visitors that it is retrieving a masked token,
   * which is used to store services of `{ multiple: true }`.
   */
  private isRetrievingPrivateToken = false;

  /**
   * Create a ContainerInstance.
   *
   * @param id The ID of the container to create.
   * @param parent The parent of the container to create.
   * The parent is used for resolving identifiers which are
   * not present in this container.
   */
  protected constructor(id: ContainerIdentifier, public readonly parent?: ContainerInstance) {
    this.id = id;
  }

  /**
   * Checks if the service with given name or type is registered service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   *
   * If recursive mode is enabled, the symbol is not available locally, and we have a parent,
   * we tell the parent to search its tree recursively too.
   * If the container tree is substantial, this operation may affect performance.
   *
   * @param identifier The identifier of the service to look up.
   *
   * @returns Whether the identifier is present in the current container, or its parent.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public has<T = unknown>(identifier: ServiceIdentifier<T>, recursive = true): boolean {
    this[THROW_IF_DISPOSED]();

    if (ALWAYS_RESOLVABLE.includes(identifier)) {
      return true;
    }

    const location = this.getIdentifierLocation(identifier);

    if (recursive && location === ServiceIdentifierLocation.Parent) {
      return true;
    }

    return location === ServiceIdentifierLocation.Local;
  }

  /**
   * Return the location of the given identifier.
   * If recursive mode is enabled, the symbol is not available locally, and we have a parent,
   * we tell the parent to search its tree recursively too.
   * If the container tree is substantial, this operation may affect performance.
   *
   * @param identifier The identifier of the service to look up.
   *
   * @returns A {@link ServiceIdentifierLocation}.
   *  - If the identifier cannot be found, {@link ServiceIdentifierLocation.None | None}.
   *  - If the identifier is found locally, {@link ServiceIdentifierLocation.Local | Local}.
   *  - If the identifier is found upstream, {@link ServiceIdentifierLocation.Parent | Parent}.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  protected getIdentifierLocation<T = unknown>(identifier: ServiceIdentifier<T>): ServiceIdentifierLocation {
    this[THROW_IF_DISPOSED]();

    if (this.metadataMap.has(identifier) || this.multiServiceIds.has(identifier)) {
      return ServiceIdentifierLocation.Local;
    }

    // If we have a parent container, see if that has the identifier.
    // todo: should we always use true here?
    if (this.parent && this.parent.has(identifier, true)) {
      return ServiceIdentifierLocation.Parent;
    }

    return ServiceIdentifierLocation.None;
  }

  /**
   * Get the value for the identifier in the current container.
   * If the identifier cannot be resolved locally, the parent tree
   * (if present) is recursively searched until a match is found
   * (or the tree is exhausted).
   *
   * @param identifier The identifier to get the value of.
   *
   * @returns The value of the identifier in the current scope.
   *
   * @throws ServiceNotFoundError
   * This exception is thrown if the identifier cannot be found in the tree.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public get<T = unknown>(identifier: ServiceIdentifier<T>, recursive?: boolean): T {
    const response = this.getOrNull<T>(identifier, recursive);

    if (response === null) {
      throw new ServiceNotFoundError(identifier);
    }

    return response as T;
  }

  /**
   * Resolve the metadata for the given identifier.  Returns null if no metadata could be found.
   *
   * @param identifier The identifier to resolve metadata for.
   * @param recursive Whether the lookup operation is recursive.
   *
   * @returns
   * If the identifier is found, a tuple is returned consisting of the following:
   *   1. The metadata for the given identifier, if found.
   *   2. The location from where the metadata was returned.
   *   {@link ServiceIdentifierLocation.Parent} is returned if the identifier was found upstream.
   *
   * If an identifier cannot be found, `null` is returned.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  protected resolveMetadata<T = unknown>(
    identifier: ServiceIdentifier<T>,
    recursive: boolean
  ): readonly [ServiceMetadata<T>, ServiceIdentifierLocation] | null {
    this[THROW_IF_DISPOSED]();

    /**
     * Firstly, ascertain the location of the identifier.
     * If it is located on the parent, we shall yield to the parent's .get.
     */
    const location = this.getIdentifierLocation(identifier);

    switch (location) {
      case ServiceIdentifierLocation.None:
        return null;
      case ServiceIdentifierLocation.Local:
        return [this.metadataMap.get(identifier) as ServiceMetadata<T>, location];
      case ServiceIdentifierLocation.Parent:
        /** Don't perform any parent lookups if we're not recursively scanning the tree. */
        if (recursive) {
          /**
           * Unpack the possibly-resolved metadata object from the parent.
           * We don't directly return the parent's resolveMetadata call here as that would
           * return "ServiceIdentifierLocation.Local" if it was resolved on the parent.
           */
          const possibleResolution = this.parent?.resolveMetadata<T>(identifier, true);

          return possibleResolution ? [possibleResolution[0], ServiceIdentifierLocation.Parent] : null;
        }

        return null;
    }
  }

  /**
   * Retrieves the service with given name or type from the service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   *
   * @param identifier The identifier to get the value of.
   *
   * @returns The resolved value for the given metadata, or `null` if it could not be found.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public getOrNull<T = unknown>(identifier: ServiceIdentifier<T>, recursive = true): T | null {
    this[THROW_IF_DISPOSED]();

    /**
     * Use the internal flag as a guide to whether we should
     * notify visitors of this retrieval.
     */
    const notifyVisitors = !this.isRetrievingPrivateToken;

    const partialVisitRetrievalOptions = { recursive, many: false } as const;

    /**
     * Provide compatibility with the `HostContainer()` API.
     */
    if (identifier === HOST_CONTAINER) {
      if (notifyVisitors) {
        this.visitor.visitRetrieval(identifier, {
          ...partialVisitRetrievalOptions,
          location: ServiceIdentifierLocation.Local,
        });
      }

      return this as unknown as T;
    }

    const maybeResolvedMetadata = this.resolveMetadata(identifier, recursive);

    if (maybeResolvedMetadata === null) {
      if (notifyVisitors) {
        /** Notify our listeners that the identifier wasn't found. */
        this.visitor.visitRetrieval(identifier, {
          ...partialVisitRetrievalOptions,
          location: ServiceIdentifierLocation.None,
        });
      }

      return null;
    }

    /**
     * At this point, we have narrowed the location of the identifier
     * down to ServiceIdentifierLocation.Local.
     * Therefore, the symbol exists locally.
     *
     * To preserve compatibility with TypeDI, if the identifier exists on
     * the parent but not locally, we still treat it as if it were resolved locally.
     */
    const [baseMetadata, location] = maybeResolvedMetadata;
    const isUpstreamMetadata = location === ServiceIdentifierLocation.Parent;

    /**
     * To preserve compatibility with TypeDI, if the identifier metadata was loaded
     * from the parent, we then import it into this container.
     * The objects are also cloned to prevent mutations from affecting this instance.
     * <https://github.com/typestack/typedi/blob/8da3ef286299bca6bd7ddf4082268f422f700630/src/container-instance.class.ts#L94>
     */
    if (isUpstreamMetadata) {
      let value: unknown;

      /**
       * If the type cannot be reconstructed  (i.e. it's a static value, possibly set via
       * {@link ContainerInstance.setValue}), do not erase the type in the new metadata.
       *
       * Furthermore, do not erase the value if the imported service is a singleton.
       * This mirrors the behaviour of the prior implementation.
       */
      const isReconstructable = baseMetadata.factory != null || baseMetadata.type != null;

      if (!isReconstructable || baseMetadata.scope === 'singleton') {
        value = baseMetadata.value;
      } else {
        value = EMPTY_VALUE;
      }

      const newServiceMetadata: ServiceMetadata<T> = {
        ...baseMetadata,
        /**
         * If the service is a singleton, we'll import its value directly into this container.
         * Otherwise, we set the value to the well-known placeholder.
         */
        value,
      };

      /**
       * If the service is a singleton, return it directly from the global container.
       * We can safely assume it exists there.
       */
      if (newServiceMetadata.scope === 'singleton') {
        return defaultContainer.getOrNull(identifier, recursive);
      }

      /**
       * If it's not a singleton, import it into the current container,
       * and then recursively call .getOrNull which takes the local path
       * instead of dealing with upstream metadata.
       */
      const newServiceID = this.set(newServiceMetadata, [...baseMetadata.dependencies]);

      /**
       * Cache the value in a variable so we're able to wrap the call in the
       * {@link ContainerInstance.isRetrievingPrivateToken} flag to prevent
       * notifying visitors.
       */
      this.isRetrievingPrivateToken = true;

      const resolvedValue = this.getOrNull(newServiceID, recursive) as T;

      /** Reset the flag to its original value. */
      this.isRetrievingPrivateToken = false;

      this.visitor.visitRetrieval(identifier, {
        ...partialVisitRetrievalOptions,
        location: ServiceIdentifierLocation.Parent,
      });

      return resolvedValue;
    }

    /**
     * Notify our listeners that the identifier was found.
     * We do this *after* the above importing code as otherwise, we would have to
     * set the {@link ContainerInstance.isRetrievingPrivateToken} flag.
     */
    if (notifyVisitors) {
      this.visitor.visitRetrieval(identifier, {
        ...partialVisitRetrievalOptions,
        location,
      });
    }

    let metadata = baseMetadata;

    /** Firstly, we shall check if the service is a singleton.  If it is, load it from the global registry. */
    if (baseMetadata?.scope === 'singleton') {
      metadata = defaultContainer.metadataMap.get(identifier) as ServiceMetadata<T>;
    }

    /** This should never happen as multi services are masked with custom token in Container.set. */
    if (metadata && metadata.multiple === true) {
      /* istanbul ignore next */
      throw Error(`Cannot resolve multiple values for ${identifier.toString()} service!`);
    }

    /** Otherwise it's returned from the current / parent container. */
    if (metadata) {
      return this.getServiceValue(metadata);
    }

    return null;
  }

  /**
   * Gets all instances registered in the container of the given service identifier.
   * Used when service are defined with the `{ multiple: true }` option.
   *
   * @example
   * ```ts
   * Container.set({ id: 'key', value: 1, dependencies: [ ], multiple: true });
   * Container.set({ id: 'key', value: 2, dependencies: [ ], multiple: true });
   * Container.set({ id: 'key', value: 3, dependencies: [ ], multiple: true });
   *
   * const [one, two, three] = Container.getMany('key');
   * ```
   *
   * @param identifier The identifier to resolve.
   *
   * @returns An array containing the service instances for the given
   * identifier.
   *
   * @throws ServiceNotFoundError
   * This exception is thrown if a value could not be found for the given identifier.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public getMany<T = unknown>(identifier: ServiceIdentifier<T>, recursive?: boolean): T[] {
    const response = this.getManyOrNull(identifier, recursive);

    if (response === null) {
      throw new ServiceNotFoundError(identifier);
    }

    return response;
  }

  /**
   * Gets all instances registered in the container of the given service identifier.
   * Used when service are defined with the `{ multiple: true }` option.
   *
   * @example
   * Here's an example:
   * ```ts
   * assert(container.getManyOrNull(UNKNOWN_TOKEN) === null);
   * assert(Array.isArray(container.getManyOrNull(KNOWN_TOKEN)));
   * ```
   *
   * @param identifier The identifier to resolve.
   *
   * @see {@link ContainerInstance.getMany}
   *
   * @returns An array containing the service instances for the given identifier.
   * If none can be found, `null` is returned.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public getManyOrNull<T = unknown>(identifier: ServiceIdentifier<T>, recursive = true): T[] | null {
    this[THROW_IF_DISPOSED]();

    let idMap: ManyServicesMetadata | void = undefined;
    let location: ServiceIdentifierLocation = ServiceIdentifierLocation.None;

    if (!this.multiServiceIds.has(identifier)) {
      /** If this container has no knowledge of the identifier, then we check the parent (if we have one). */
      if (recursive && this.parent && this.parent.multiServiceIds.has(identifier)) {
        /** It looks like it does! Let's use that instead. */
        idMap = this.parent.multiServiceIds.get(identifier) as ManyServicesMetadata;
        location = ServiceIdentifierLocation.Parent;
      }
    } else {
      idMap = this.multiServiceIds.get(identifier);

      if (idMap) {
        location = ServiceIdentifierLocation.Local;
      }
    }

    /** Notify listeners we have retrieved a service. */
    this.visitor.visitRetrieval(identifier, {
      recursive,
      many: true,
      location,
    });

    /** If no IDs could be found, return null. */
    if (!idMap) {
      return null;
    }

    const isRetrievingSingleton = idMap.scope === 'singleton';
    const targetContainer = isRetrievingSingleton ? defaultContainer : this;

    /**
     * Prevent {@link ContainerInstance.getOrNull} from notifying
     * visitors that we are retrieving a masked token.
     */
    targetContainer.isRetrievingPrivateToken = true;

    /**
     * If the service is registered as a singleton, we load it from the global container.
     * Otherwise, the local registry is used.
     */
    const subject = (generatedId: Token<unknown>) =>
      targetContainer.get<T>(generatedId, targetContainer === defaultContainer ? undefined : recursive);

    const mapped = idMap.tokens.map(subject);

    /** Restore the flag we set above to its original value. */
    targetContainer.isRetrievingPrivateToken = false;

    return mapped;
  }

  /**
   * Add a service to the container using the provided options, along with
   * a pre-wrapped list of dependencies.
   *
   * _This is mainly for internal use._
   *
   * @param serviceOptions The options for the service to add to the container.
   * @param precompiledDependencies A precompiled list of dependencies in {@link TypeWrapper} form for the given service.
   *
   * @returns The identifier of the given service in the container.
   * This can then be passed to {@link ContainerInstance.get | .get} to resolve the identifier.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public set<T = unknown>(
    serviceOptions: Omit<ServiceOptions<T>, 'dependencies'>,
    precompiledDependencies: Resolvable[]
  ): ServiceIdentifier;

  /**
   * Add a service to the container using the provided options, containing
   * all information about the new service including its dependencies.
   *
   * @param serviceOptions The options for the service to add to the container.
   *
   * @returns The identifier of the given service in the container.
   * This can then be passed to {@link ContainerInstance.get | .get} to resolve the identifier.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public set<T = unknown>(serviceOptions: ServiceOptionsWithDependencies<T>): ServiceIdentifier;
  public set<T = unknown>(
    serviceOptions: ServiceOptions<T> | Omit<ServiceOptions<T>, 'dependencies'>,
    precompiledDependencies?: Resolvable[]
  ): ServiceIdentifier {
    this.throwIfDisposed();

    /**
     * Check if the identifier being set is a virtual one,
     * such as HostContainer.
     * If so, we can't reasonably allow this service to be set.
     */
    if (ALWAYS_RESOLVABLE.includes((serviceOptions as any).id as ServiceIdentifier)) {
      throw new Error('Virtual identifiers can not be overriden.');
    }

    /**
     * If the service is marked as singleton, we set it in the default container.
     * (And avoid an infinite loop via checking if we are in the default container or not.)
     */
    if ((serviceOptions as any)['scope'] === 'singleton' && defaultContainer !== this) {
      /**
       * 1. The (as any) cast above is for performance: why bother putting the arguments
       * together if we can very quickly determine if the argument is of type object?
       * If we did this return below, we'd be wasting a newly-constructed object, PLUS
       * a few function calls to helpers like resolveToTypeWrapper.
       *
       * 2. Below, we trick TypeScript into thinking we're using the 1st overload here.
       * However, we haven't actually checked the types of each argument.
       * This is, of course, left to ContainerInstance#set.
       */
      // todo: should we really be binding to defaultContainer here?
      return defaultContainer.set(
        serviceOptions as Omit<ServiceOptions<T>, 'dependencies'>,
        precompiledDependencies as Resolvable[]
      );
    }

    /**
     * The dependencies of the object are either delivered in a pre-compiled list of TypeWrapper objects (from @Service),
     * or from the dependencies list of the service options object, which must then be compiled to a list of type wrappers.
     */
    const dependencies: Resolvable[] =
      precompiledDependencies ??
      (serviceOptions as ServiceOptions<NewableFunction>)?.dependencies?.map(wrapDependencyAsResolvable) ??
      [];

    const newMetadata: ServiceMetadata<T> = {
      /**
       * Typescript cannot understand that if ID doesn't exists then type must exists based on the
       * typing so we need to explicitly cast this to a `ServiceIdentifier`
       */
      id: ((serviceOptions as any).id ?? (serviceOptions as any).type) as ServiceIdentifier,
      type: null,
      ...SERVICE_METADATA_DEFAULTS,

      /** We allow overriding the above options via the received config object. */
      ...serviceOptions,

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /**
       * We override the service options with the provided dependencies here, as if we have type wrapped
       * dependencies only, we'll obviously want to overwrite anything in the options with those.
       * Additionally, this fixes test cases such as #151.
       */
      /** @ts-ignore TypeScript is actually broken here. We've told it dependencies is of type TypeWrapper[], but it still doesn't like it? */
      dependencies: dependencies as unknown as TypeWrapper[],
    };

    this.visitor.visitNewService(newMetadata);

    /** If the incoming metadata is marked as multiple we mask the ID and continue saving as single value. */
    if (newMetadata.multiple) {
      const maskedToken = new Token(`MultiMaskToken-${newMetadata.id.toString()}`);
      const existingMultiGroup = this.multiServiceIds.get(newMetadata.id);

      if (existingMultiGroup) {
        existingMultiGroup.tokens.push(maskedToken);
      } else {
        this.multiServiceIds.set(newMetadata.id, { scope: newMetadata.scope, tokens: [maskedToken] });
      }

      /**
       * We mask the original metadata with this generated ID, mark the service
       * as  and continue multiple: false and continue. Marking it as
       * non-multiple is important otherwise Container.get would refuse to
       * resolve the value.
       */
      newMetadata.id = maskedToken;
      newMetadata.multiple = false;
    }

    // todo: sort this out
    // I've removed the legacy "extend service if it already exists"
    // behaviour for now.
    // const existingMetadata = this.metadataMap.get(newMetadata.id);

    /** This service hasn't been registered yet, so we register it. */
    this.metadataMap.set(newMetadata.id, newMetadata);

    /**
     * If the service is eager, we need to create an instance immediately except
     * when the service is also marked as transient. In that case we ignore
     * the eager flag to prevent creating a service what cannot be disposed later.
     */
    if (newMetadata.eager && newMetadata.scope !== 'transient') {
      this.get(newMetadata.id);
    }

    return newMetadata.id;
  }

  /**
   * Add a value to the container.
   *
   * @example
   * ```ts
   * // We can simplify this:
   * Container.set({ id: 'key', value: 'test', dependencies: [ ] });
   * // To this:
   * Container.setValue('key', 'test');
   * ```
   *
   * @param id The ID of the new value to set inside the container.
   * Must be either a string or a Token.
   *
   * @param value The value to set the ID to.
   *
   * @returns The identifier of the given service in the container.
   * This can then be passed to {@link ContainerInstance.get | .get} to resolve the identifier.
   */
  public setValue<
    TServiceID extends string | Token<TValue>,
    TValue extends TServiceID extends Token<infer U> ? U : unknown
  >(id: TServiceID, value: TValue) {
    if (typeof id !== 'string' && !(id instanceof Token)) {
      throw Error('The ID passed to setValue must either be a string or a Token.');
    }

    return this.set({ id, value }, []);
  }

  /**
   * Removes services with the given list of service identifiers.
   *
   * @param identifierOrIdentifierArray The list of service identifiers to remove from the container.
   *
   * @example
   * Here's an example:
   * ```ts
   * const NAME = new Token<string>();
   *
   * // Set a new identifier in the container:
   * defaultContainer.setValue(NAME, 'Joanna');
   * assert(defaultContainer.get(NAME) === 'Joanna');
   *
   * // Now remove it, making the container forget it ever existed:
   * defaultContainer.remove(NAME);
   * assert(defaultContainer.getOrNull(NAME) === null);
   * ```
   *
   * @returns The current {@link ContainerInstance} instance.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public remove(identifierOrIdentifierArray: ServiceIdentifier | ServiceIdentifier[]): this {
    this[THROW_IF_DISPOSED]();
    if (Array.isArray(identifierOrIdentifierArray)) {
      identifierOrIdentifierArray.forEach(id => this.remove(id));
    } else {
      const serviceMetadata = this.metadataMap.get(identifierOrIdentifierArray);

      if (serviceMetadata) {
        this.disposeServiceInstance(serviceMetadata);
        this.metadataMap.delete(identifierOrIdentifierArray);
      }
    }

    return this;
  }

  /**
   * Gets a separate container instance for the given instance id.
   * Optionally, a parent can be passed, which will act as an upstream resolver for the container.
   *
   * @remarks This is functionally equivalent to {@link ContainerInstance.of}.
   * However, it allows container creation from a static interface.
   *
   * @example
   * ```ts
   * // Create a container which has the default container as its parent:
   * ContainerInstance.of('my-new-container');
   *
   * // Create a container without a parent:
   * ContainerInstance.of('my-new-container-without-a-parent', null);
   *
   * // Create a container with a separate container:
   * ContainerInstance.of('my-new-special-container', myOtherContainer);
   * ```
   *
   * @param containerId The ID of the container to resolve or create.  Defaults to "default".
   * @param parent The parent of the container, or null to explicitly signal that one should not be provided.
   * Defaults to the default container.
   * @param options The options to supplement how the container is created.
   *
   * @see {@link CreateContainerOptions}
   *
   * @returns The newly-created {@link ContainerInstance}, or the pre-existing container with the same name
   * if one already exists.
   */
  public static of<TOptions extends CreateContainerOptions>(
    containerId: ContainerIdentifier = 'default',
    parent: ContainerInstance | null = defaultContainer,
    options?: TOptions
  ): CreateContainerResult<TOptions> {
    if (containerId === 'default') {
      return defaultContainer;
    }

    // todo: test parent= default arg

    let container: ContainerInstance;
    const conflictDefinition = options?.conflictDefinition ?? 'rejectAll';

    /**
     * If a conflict definition is passed without an accompanying strategy,
     * we default to `throw`. This makes the API more consistent.
     */
    const onConflict = options?.onConflict ?? (options?.conflictDefinition ? 'throw' : 'returnExisting');

    const onFree = options?.onFree ?? 'returnNew';

    if (ContainerRegistry.hasContainer(containerId)) {
      container = ContainerRegistry.getContainer(containerId);

      /**
       * Test whether the container matches according to the conflict
       * definition given by the caller.
       */
      const containerMatches =
        conflictDefinition === 'allowSameParent'
          ? container.parent === parent
          : /**
             * To shave a few bytes off the output, we emit false here, as that should
             * always happen if the value is 'rejectAll' (and we've narrowed it to that).
             */
            false;

      if (!containerMatches) {
        /** Note: 'returnExisting' is deliberarely ignored here, as that is the default logic. */
        if (onConflict === 'null') {
          /**
           * The cast here is correct.
           * TypeScript isn't smart enough to understand that, if 'onConflict' is 'null'
           * and the container already exists, we're allowed to return null to the caller.
           */
          return null as unknown as ContainerInstance;
        } else if (onConflict === 'throw') {
          throw new Error(`A container with the specified name ("${String(containerId)}") already exists.`);
        }
      }
    } else {
      if (onFree === 'null') {
        /** As above: The cast here is correct. */
        return null as unknown as ContainerInstance;
      } else if (onFree === 'throw') {
        throw new Error(`A container with the specified name ("${String(containerId)}) does not already exist.`);
      }
      /**
       * This is deprecated functionality, for now we create the container if it's doesn't exists.
       * This will be reworked when container inheritance is reworked.
       */
      container = new ContainerInstance(containerId, parent ?? undefined);

      if (parent === null) {
        /**
         * To keep an understandable API surface, visitors attached to
         * the default container are notified of the new orphaned service here.
         * _Note: Orphaned container notifications are only sent for newly-created containers, not duplicate .of calls._
         */
        defaultContainer.visitor.visitOrphanedContainer(container);
      }

      // todo: move this into ContainerInstance ctor
      ContainerRegistry.registerContainer(container);
    }

    return container;
  }

  /**
   * Gets a separate container instance for the given instance id.
   *
   * @param containerId The ID of the container to resolve or create.  Defaults to "default".
   *
   * @example
   * ```
   * const newContainer = Container.of('foo');
   *
   * @Service({ container: newContainer }, [])
   * class MyService {}
   * ```
   *
   * @returns The newly-created {@link ContainerInstance}, or the pre-existing container
   * with the same name if one already exists.
   */
  public of<TOptions extends CreateContainerOptions>(
    containerId?: ContainerIdentifier,
    options?: TOptions
  ): CreateContainerResult<TOptions> {
    // Todo: make this get the constructor at runtime to aid
    // extension of the class.
    /** _Note: The visitor API is not called here, as that is handled in the static method._ */
    return ContainerInstance.of(containerId, defaultContainer, options);
  }

  /**
   * Create a registry with the specified ID, with this instance as its parent.
   *
   * @param containerId The ID of the container to resolve or create.  Defaults to "default".
   *
   * @returns The newly-created {@link ContainerInstance}, or the pre-existing container
   * with the same name if one already exists.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public ofChild<TOptions extends CreateContainerOptions>(
    containerId?: ContainerIdentifier,
    options?: TOptions
  ): CreateContainerResult<TOptions> {
    this[THROW_IF_DISPOSED]();

    const newContainer = ContainerInstance.of(containerId, this, options);

    if (newContainer) {
      this.visitor.visitChildContainer(newContainer);
    }

    return newContainer;
  }

  /**
   * Completely resets the container by removing all previously registered services from it.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public reset(
    options: ContainerResetOptions = {
      strategy: ContainerResetStrategy.ResetValue,
    }
  ): this {
    this[THROW_IF_DISPOSED]();

    switch (options.strategy) {
      case ContainerResetStrategy.ResetValue:
        this.metadataMap.forEach(service => this.disposeServiceInstance(service));
        break;
      case ContainerResetStrategy.ResetServices:
        this.metadataMap.forEach(service => this.disposeServiceInstance(service));
        this.metadataMap.clear();
        this.multiServiceIds.clear();
        break;
      default:
        throw Error('Received invalid reset strategy.');
    }
    return this;
  }

  /**
   * Dispose the container, rendering it unable to perform any further injection or storage.
   *
   * @remarks
   * It is currently not advised to dispose of the default container.
   * This would result in resolution issues in your application.
   *
   * @example
   * ```ts
   * const appContainer = Container.of('app');
   *
   * appContainer.dispose().then(
   *   () => console.log('The container has been disposed.')
   * );
   *
   * appContainer.disposed === true;
   *
   * // This will throw an error:
   * appContainer.get(
   *   new Token<unknown>('test')
   * );
   * ```
   *
   * @returns A promise that resolves when the disposal process is complete.
   *
   * @throws Error
   * This exception is thrown if the container has been disposed.
   */
  public async dispose(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/require-await
    this[THROW_IF_DISPOSED]();

    this.reset({ strategy: 'resetServices' });

    /** We mark the container as disposed, forbidding any further interaction with it. */
    (this as any).disposed = true;

    /** Also dispose visitors. */
    this.visitor.dispose();
  }

  private throwIfDisposed() {
    if (this.disposed) {
      // TODO: Use custom error.
      throw Error('Cannot use container after it has been disposed.');
    }
  }

  /**
   * Gets the value belonging to passed in {@link ServiceMetadata} instance.
   *
   * @remarks
   * - If {@link ServiceMetadata.value | serviceMetadata.value} is present, it is immediately returned.
   * - Alternatively, the requested type is resolved to the appropriate value,
   * which is then saved to {@link ServiceMetadata.value | serviceMetadata.value} and returned.
   */
  private getServiceValue(serviceMetadata: ServiceMetadata<unknown>): any {
    let value: unknown = EMPTY_VALUE;

    /**
     * The "serviceMetadata.factory" property lookup is inlined into a variable here
     * as its value will never change, and it reduces the final size of the bundle.
     */
    const { factory: factoryMeta } = serviceMetadata;

    /**
     * If the service value has been set to anything prior to this call we return that value.
     * NOTE: This part builds on the assumption that transient dependencies has no value set ever.
     */
    if (serviceMetadata.value !== EMPTY_VALUE) {
      return serviceMetadata.value;
    }

    /** If both factory and type is missing, we cannot resolve the requested ID. */
    if (!factoryMeta && !serviceMetadata.type) {
      throw new CannotInstantiateValueError(serviceMetadata.id);
    }

    /**
     * If a factory is defined it takes priority over creating an instance via `new`.
     * The return value of the factory is not checked, we believe by design that the user knows what he/she is doing.
     */
    if (factoryMeta) {
      /**
       * If we received the factory in the [Constructable<Factory>, "functionName"] format, we need to create the
       * factory first and then call the specified function on it.
       */
      if (Array.isArray(factoryMeta)) {
        const [factoryServiceId, factoryServiceMethod] = factoryMeta;

        /** Try to get the factory from TypeDI first, if failed, fall back to simply initiating the class. */
        const factoryInstance = this.getOrNull<any>(factoryServiceId) ?? new factoryServiceId();
        value = factoryInstance[factoryServiceMethod](this, serviceMetadata.id);
      } else {
        /** If only a simple function was provided we simply call it. */
        value = factoryMeta(this, serviceMetadata.id);
      }
    }

    /**
     * If no factory was provided and only then, we create the instance from the type if it was set.
     */
    if (!factoryMeta && serviceMetadata.type) {
      const constructableTargetType: Constructable<unknown> = serviceMetadata.type;
      const parameters = this.getConstructorParameters(serviceMetadata, true);
      value = new constructableTargetType(...parameters);
    }

    /** If this is not a transient service, and we resolved something, then we set it as the value. */
    if (serviceMetadata.scope !== 'transient' && value !== EMPTY_VALUE) {
      serviceMetadata.value = value;
    }

    if (value === EMPTY_VALUE) {
      /** This branch should never execute, but better to be safe than sorry. */
      throw new CannotInstantiateValueError(serviceMetadata.id);
    }

    return value;
  }

  private getConstructorParameters<T>({ dependencies }: ServiceMetadata<T>, guardBuiltIns?: boolean): unknown[] {
    /**
     * Firstly, check if the metadata declares any dependencies.
     */
    if (dependencies.length === 0) {
      return [];
    }

    /**
     * We do not type-check the identifiers array here as we are the only ones
     * aware of the reflective key.
     * Therefore, it can be safely assumed that if the key is present, the correct
     * data will also be present.
     */
    return dependencies.map(wrapper => this.resolveResolvable(wrapper));
  }

  /**
   * Resolve a {@link Resolvable} object in the current container.
   *
   * @param resolvable The {@link Resolvable} to resolve.
   *
   * @returns The resolved value of the item.
   */
  private resolveResolvable(resolvable: Resolvable): unknown {
    const identifier = this.resolveTypeWrapper(resolvable.typeWrapper);

    if (resolvable.constraints) {
      const { constraints } = resolvable;

      let resolvedIdentifier!: unknown;

      /**
       * For the individual bit flags, we don't care about the return from `&`.
       * All that matters is that, if it doesn't return 0, the flag is activated.
       *
       * Implementation note: as an optimisation, we use double negative to cast
       * the result to boolean instead of an explicit `Boolean` call here.
       * To clarify, the "!!" does the *exact* same thing as `Boolean`.
       */
      const isOptional = !!(constraints & ResolutionConstraintFlag.Optional);
      const isSkipSelf = !!(constraints & ResolutionConstraintFlag.SkipSelf);
      const isSelf = !!(constraints & ResolutionConstraintFlag.Self);
      const isMany = !!(constraints & ResolutionConstraintFlag.Many);

      /** SkipSelf() and Self() are incompatible. */
      if (isSkipSelf && isSelf) {
        throw Error('SkipSelf() and Self() cannot be used at the same time.');
      }

      /** If SkipSelf is declared, make sure we actually *have* a parent. */
      if (isSkipSelf && !this.parent) {
        throw Error(`The SkipSelf() flag was enabled, but the subject container does not have a parent.`);
      }

      /**
       * If SkipSelf() is provided, use the parent container for lookups instead.
       * If not, we use the current container.
       */
      const targetContainer = isSkipSelf ? (this.parent as ContainerInstance) : this;

      /** If Self() is used, do not use recursion. */
      const recursive = !isSelf ?? undefined;

      /**
       * Set up some state registers for various flag configurations.
       */
      const identifierIsPresent = targetContainer.has(identifier, recursive);

      /**
       * Straight away, check if optional was declared.
       * If it was not and the symbol was not found, throw an error.
       * However, if it *was*, simply return `null` as expected.
       */
      if (!identifierIsPresent) {
        if (isOptional) {
          return null;
        }

        throw new ServiceNotFoundError(identifier);
      }

      if (isMany) {
        /** If we're in isMany mode, resolve the identifier via `getMany`. */
        resolvedIdentifier = targetContainer.getMany(identifier, recursive);
      } else {
        resolvedIdentifier = targetContainer.get(identifier, recursive);
      }

      return resolvedIdentifier;
    }

    /** If no constraints were found, fallback to default behaviour. */
    return this.get(identifier);
  }

  private resolveTypeWrapper(wrapper: TypeWrapper, guardBuiltIns = false): ServiceIdentifier {
    /**
     * Reminder: The type wrapper is either resolvable to:
     *   1. An eager type containing the id of the service, or...
     *   2. A lazy type containing a function that must be called to resolve the id.
     *
     * Therefore, if the eager type does not exist, the lazy type should.
     */
    /** ESLint removes the cast, which causes a compilation error: */
    // eslint-disable-next-line
    const resolved = wrapper.eagerType ?? (wrapper as GenericTypeWrapper).lazyType?.();

    if (resolved == null) {
      throw Error(`The wrapped value could not be resolved.`);
    }

    if (guardBuiltIns && (BUILT_INS as unknown[]).includes(resolved)) {
      throw new CannotInstantiateBuiltInError((resolved as Constructable<unknown>)?.name ?? resolved);
    }

    /**
     * We also need to search the graph recursively.
     * This is in-line with prior behaviour, ensuring that services
     * from upstream containers can be resolved correctly.
     */
    return resolved;
  }

  /**
   * Check if the given service is able to be destroyed and, if so, destroys it in-place.
   * @deprecated
   *
   * @remarks
   * If the service contains a method named `destroy`, it is called.
   * However, the value it returns is ignored.
   *
   * @param serviceMetadata the service metadata containing the instance to destroy
   * @param force when true the service will be always destroyed even if it's cannot be re-created
   */
  private disposeServiceInstance(serviceMetadata: ServiceMetadata, force = false) {
    this[THROW_IF_DISPOSED]();

    /** We reset value only if we can re-create it (aka type or factory exists). */
    const shouldResetValue = force || !!serviceMetadata.type || !!serviceMetadata.factory;

    if (shouldResetValue) {
      /** If we wound a function named destroy we call it without any params. */
      if (typeof (serviceMetadata?.value as Record<string, unknown>)['dispose'] === 'function') {
        try {
          (serviceMetadata.value as { dispose: CallableFunction }).dispose();
        } catch (error) {
          /** We simply ignore the errors from the destroy function. */
        }
      }

      serviceMetadata.value = EMPTY_VALUE;
    }
  }

  /**
   * Add a visitor to the container.
   * @experimental
   *
   * @param visitor The visitor to add to this container.
   *
   * @see {@link ContainerTreeVisitor}
   *
   * @returns Whether the operation was successful.
   */
  public acceptTreeVisitor(visitor: ContainerTreeVisitor) {
    return this.visitor.addVisitor(visitor, this);
  }

  /**
   * Remove a visitor from the container.
   * No-op if the visitor was never attached to the container.
   * @experimental
   *
   * @param visitor The visitor to remove from the container.
   *
   * @see {@link ContainerTreeVisitor}
   *
   * @returns Whether the operation was successful.
   */
  public detachTreeVisitor(visitor: ContainerTreeVisitor) {
    return this.visitor.removeVisitor(visitor);
  }

  /** Iterate over each service in the container. */
  public [Symbol.iterator](): IterableIterator<[ServiceIdentifier, ServiceMetadata<unknown>]> {
    return this.metadataMap.entries();
  }
}

/**
 * Keep a reference to the default container which we then utilise
 * in {@link ContainerInstance}.  This reduces the final size of the bundle,
 * as we are referencing a static variable instead of continuously
 * looking up a property.
 */
null;

export const { defaultContainer } = ContainerInstance;

/**
 * Register the default container in ContainerRegistry.
 * We don't use `ContainerInstance.of` here we don't need to check
 * if a container with the "default" ID already exists: it never will.
 */
ContainerRegistry.registerContainer(defaultContainer);
