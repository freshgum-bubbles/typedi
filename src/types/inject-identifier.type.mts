import { ContainerInstance } from '../container-instance.class.mjs';
import { INJECTED_FACTORY } from '../constants/type-stamps.const.mjs';
import { LazyReference } from './lazy-reference.type.mjs';
import { ServiceIdentifier } from './service-identifier.type.mjs';

export type InjectedFactoryGet<TReturn> = (container: ContainerInstance) => TReturn;

export interface InjectedFactory<T = unknown, TReturn = unknown> {
  [INJECTED_FACTORY]: true;
  get: InjectedFactoryGet<TReturn | InjectedFactory>;
  id: ServiceIdentifier<T>;
}

export type AnyInjectIdentifier =
  | ServiceIdentifier
  | InjectedFactory
  | LazyReference<ServiceIdentifier | InjectedFactory>;
