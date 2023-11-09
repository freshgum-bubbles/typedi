import { VIRTUAL_IDENTIFIERS } from "../../constants/virtual-ids.const.mjs";
import { ServiceIdentifier } from "../../index.mjs";

/**
 * Attain whether the provided identifier is virtual, meaning it has no concrete
 * value, and it is dynamically resolved by the Container at runtime.
 *
 * An example of a virtual identifier would be {@link HostContainer}.
 *
 * @param identifier The identifier to test.
 * @returns Whether the provided identifier is virtual.
 */
export function isVirtualIdentifier<TIdentifier extends ServiceIdentifier> (identifier: TIdentifier) {
    return VIRTUAL_IDENTIFIERS.includes(identifier);
}
