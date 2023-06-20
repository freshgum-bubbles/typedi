import { ServiceOptions } from "../interfaces/service-options.interface";
import { AnyConstructable } from "../types/any-constructable.type";
import { AnyInjectIdentifier } from "../types/inject-identifier.type";
import { Service } from "./service.decorator";

export function JSService<T extends AnyConstructable>(dependencies: AnyInjectIdentifier[], constructor: T): T;
export function JSService<T extends AnyConstructable>(options: Omit<ServiceOptions<T>, 'dependencies'>, dependencies: AnyInjectIdentifier[], constructor: T): T;
export function JSService<T extends AnyConstructable>(options: ServiceOptions<T>, constructor: T): T;

export function JSService<T extends AnyConstructable>(
    optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyInjectIdentifier[], 
    dependenciesOrConstructor: AnyInjectIdentifier[] | T, 
    maybeConstructor?: T
): T {
    let constructor!: T;

    if (typeof dependenciesOrConstructor === 'function') {
        constructor = dependenciesOrConstructor as T;
        Service(optionsOrDependencies as ServiceOptions<T> & { dependencies: AnyInjectIdentifier[] })(constructor);
    } else if (maybeConstructor) {
        constructor = maybeConstructor;
        Service(optionsOrDependencies, dependenciesOrConstructor)(constructor);
    }

    if (!constructor) {
        throw new Error('The JSService overload was not used correctly.');
    }

    return constructor;
}

export type JSService<T> = T extends AnyConstructable<infer U> ? U : never;
