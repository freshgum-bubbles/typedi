import { TYPE_WRAPPER, TypeWrapperStamp } from "../constants/type-wrapper.const.mjs";
import { ContainerInstance, ServiceIdentifier } from "../index.mjs";
import { InferServiceType } from "../types/infer-service-type.type.mjs";
import { TypeWrapper } from "../types/type-wrapper.type.mjs";

/**
 * Create a lazy reference to a value.
 * This is typically used to signal to `@InjectAll` that a reference must
 * not be eagerly loaded, e.g. in the case of cyclic dependencies.
 */
export function Lazy<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>>(
  fn: () => TIdentifier
): TypeWrapper<TIdentifier, TInstance> {
  return {
    [TYPE_WRAPPER]: TypeWrapperStamp.Generic,
    lazyType: fn,

    /**
     * Because extractable type-wrappers are able to completely override the resolution process,
     * we need to ensure that we resolve the constrained identifier directly in the container.
     * 
     * To do this, the previous constraint resolution method was modularized, with the core resolution
     * process extracted into a new method.  This lets us call it from type-wrappers.
     */
    extract: (container, constraints) =>
      (
        container as unknown as { resolveConstrainedIdentifier: ContainerInstance['resolveConstrainedIdentifier'] }
      ).resolveConstrainedIdentifier(fn(), constraints) as TInstance,
  };
}
