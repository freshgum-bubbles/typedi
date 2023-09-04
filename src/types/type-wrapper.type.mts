import { InjectedFactory } from './inject-identifier.type.mjs';
import { ServiceIdentifier } from './service-identifier.type.mjs';

export interface GenericTypeWrapper {
  eagerType: ServiceIdentifier | null;
  lazyType: (type?: never) => ServiceIdentifier;
  isFactory: false;
}

interface FactoryTypeWrapper extends Omit<GenericTypeWrapper, 'isFactory' | 'lazyType'> {
  eagerType: null;
  factory: InjectedFactory;
  isFactory: true;
}

export type TypeWrapper = GenericTypeWrapper | FactoryTypeWrapper;
