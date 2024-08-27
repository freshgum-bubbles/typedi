import { TYPE_WRAPPER, TypeWrapperStamp } from "../constants/type-wrapper.const.mjs";
import { ServiceIdentifier } from "../index.mjs";
import { ContainerInternals } from "../interfaces/container-internals.interface.mjs";
import { InferServiceType } from "../types/infer-service-type.type.mjs";
import { TypeWrapper } from "../types/type-wrapper.type.mjs";

/**
 * Create a forward reference to a value.
 *
 * This is useful in the case of cyclic dependencies, where two `@Service` calls are referencing each other.
 * In this case, the cyclic dependency can be broken by this function.
 *
 * This function is the equivalent to Angular's `forwardRef`.
 */
export function forwardRef<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>>(
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
          (container as unknown as ContainerInternals).resolveConstrainedIdentifier(fn(), constraints) as TInstance,
      };
}