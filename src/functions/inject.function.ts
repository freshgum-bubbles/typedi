import { ContainerInstance } from "../container-instance.class";
import { ServiceIdentifier } from "../types/service-identifier.type";

/**
 * Inject a list of dependencies into a given callback.
 * 
 * @remarks
 * This is somewhat similar to Angular's `inject` functionality.
 * While the notion of an injector "context" is nonexistent in
 * TypeDI, the usage is somewhat similar.
 * 
 * @example
 * ```ts
 * inject(
 *  [OtherService, AnotherService], 
 *  (other: OtherService, another: AnotherService) => {
 *  // ...
 * });
 * ```
 */
export function inject<TDependencies extends ServiceIdentifier[]> (
    dependencies: TDependencies, 
    injector: ContainerInstance,
    // TODO: update this when deps type-checking is live
    contextFn: (...dependencies: unknown[]) => void
) {
    const retrievedDeps = dependencies.map(dependency => injector.get(dependency));
    contextFn(...retrievedDeps);
}