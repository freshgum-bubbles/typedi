import { Lazy } from '../functions/lazy.function';
import { InjectedFactory } from './inject-identifier.type';
import { ServiceIdentifier } from './service-identifier.type';

/**
 * @fileoverview
 * Type wrappers are used within TypeDI to provide a universal internal API
 * for parsing a service's dependencies.  Each service identifier marked as 
 * a dependency of another service is wrapped into a TypeWrapper.
 * 
 * This is mainly to support the usage of lazy references throughout TypeDI,
 * to allow consumers to use lazy references (via {@link Lazy}) in the case
 * of cyclic dependencies.
 * 
 * It should be noted that type wrappers are an implementation quirk of the
 * upstream, TypeStack TypeDI implementation.  They're being kept around for
 * now as they seem to mostly make sense, aside from a few areas where they
 * could be simplified to create a smaller, more versatile API.
 * 
 * Type wrappers should generally be considered an implementation detail of
 * the library.  The structure of type wrappers should not be leaked or passed
 * to consumers under any ordinary circumstances, as their implementation
 * could change at any time.
 * Therefore, any type related to type wrappers is marked as internal.
 */

/**
 * A generic type wrapper, which either holds a lazily-bound type, or an eager one.
 * Injected factories are also supported here.
 * @internal
 */
export interface GenericTypeWrapper {
  eagerType: ServiceIdentifier | null;
  lazyType: (type?: never) => ServiceIdentifier;
  isFactory: false;
}

/**
 * A variant of {@link GenericTypeWrapper} for creating type wrappers via injected factories.
 * @internal
 */
interface FactoryTypeWrapper extends Omit<GenericTypeWrapper, 'isFactory' | 'lazyType'> {
  eagerType: null;
  factory: InjectedFactory;
  isFactory: true;
}

/**
 * A type wrapper, which wraps either a lazy or eager reference to an object.
 * @internal
 * 
 * @see {@link GenericTypeWrapper}
 * @see {@link FactoryTypeWrapper}
 */
export type TypeWrapper = GenericTypeWrapper | FactoryTypeWrapper;
