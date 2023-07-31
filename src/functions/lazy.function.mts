import { TYPE_WRAPPER } from "../constants/type-wrapper.const.mjs";
import { ServiceIdentifier } from "../index.mjs";
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
    $$$: TYPE_WRAPPER,
    lazyType: fn,
    unpack: container => container.get(fn()) as unknown as TInstance,
  };
}
