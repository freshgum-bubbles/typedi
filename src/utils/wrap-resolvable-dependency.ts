import { Resolvable } from "../interfaces/resolvable.interface";
import { AnyServiceDependency, DependencyPairWithConfiguration } from "../interfaces/service-options-dependency.interface";
import { AnyInjectIdentifier } from "../types/inject-identifier.type";
import { ServiceIdentifier } from "../types/service-identifier.type";
import { TypeWrapper } from "../types/type-wrapper.type";
import { resolveToTypeWrapper } from "./resolve-to-type-wrapper.util";

export function wrapDependencyAsResolvable (dependency: AnyServiceDependency): Resolvable {
    let constraints!: number | undefined;
    let typeWrapper!: TypeWrapper;

    if (Array.isArray(dependency)) {
        /** The dependency is a [ID, options] pair. Let's parse it as such. */
        const [id, options] = (dependency as DependencyPairWithConfiguration);

        /** Perform some very basic sanity checking on the pair. */
        if (id == null || options == null) {
            // TODO: make this more descriptive
            throw new Error('The dependency pair was not instantiated correctly.');
        }

        typeWrapper = resolveToTypeWrapper(id);
    } else {
        /** The dependency is an injectable identifier. */
        typeWrapper = resolveToTypeWrapper(dependency as AnyInjectIdentifier);
    }

    return {
        constraints,
        typeWrapper
    };
}