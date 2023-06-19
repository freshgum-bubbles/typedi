import { INJECTED_FACTORY } from "../../type-stamps.const";
import { InjectedFactoryGet, InjectedFactory } from "../../types/inject-identifier.type";
import { ServiceIdentifier } from "../../types/service-identifier.type";

export function Transform<T, TReturn> (id: ServiceIdentifier, get: InjectedFactoryGet<TReturn>): InjectedFactory<T> {
    return { get, [INJECTED_FACTORY]: true, id };
}
