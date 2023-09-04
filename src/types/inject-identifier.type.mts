import { ContainerInstance } from '../container-instance.class.mts';
import { INJECTED_FACTORY } from '../constants/type-stamps.const.mts';
import { LazyReference } from './lazy-reference.type.mts';
import { ServiceIdentifier } from './service-identifier.type.mts';

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
