import { TypeWrapperStamp } from '../constants/type-wrapper.const.mjs';
import { ContainerInstance } from '../container-instance.class.mjs';
import { InferServiceType } from './infer-service-type.type.mjs';
import { ResolutionConstraintFlag } from './resolution-constraint.type.mjs';
import { ServiceIdentifier } from './service-identifier.type.mjs';
import { TYPE_WRAPPER } from '../constants/type-wrapper.const.mjs';

interface StampedTypeWrapper {
  /**
   * The {@link TYPE_WRAPPER} symbol acts as a stamp to allow us to duck-type checks
   * for TypeWrapper objects instead of checking each member (eagerType, extract),
   * which would cause drops in runtime performance.
   *
   * We use the number 1 because it saves a few bytes in the bundle.
   * When we check this property, we don't really care about its value, we just care
   * that it exists.
   */
  readonly [TYPE_WRAPPER]: TypeWrapperStamp.Generic;
}

export interface EagerTypeWrapper extends StampedTypeWrapper {
  /**
   * The type that the identifier eagerly resolves to.
   *
   * @remarks
   * As an example, in the case of a class service "MyService", this would
   * be a reference to "MyService".
   */
  eagerType: ServiceIdentifier;
  extract?: undefined;
}

export interface ExtractableTypeWrapper<
TIdentifier extends ServiceIdentifier = ServiceIdentifier,
TInstance = InferServiceType<TIdentifier>,
> extends StampedTypeWrapper {
  /**
   * Resolve a customised value, which will be injected into the constructor
   * of a service upon its initialisation.
   *
   * This method is called when a service, which has been authored with this TypeWrapper
   * in its list of dependencies, is created by a {@link ContainerInstance}.
   *
   * @param container The container from which the service is being constructed.
   * The presence of the {@link SkipSelf} resolution constraint does not affect
   * the value of this parameter.
   *
   * @param constraints The constraints for this dependency, as specified
   * by the author of the service.
   * If no constraints were specified, this defaults to {@link ResolutionConstraintFlag.None}.
   *
   * @remarks
   * The presence of this method denotes an extractable TypeWrapper, which provides
   * customised handling for the resolution of a service's dependency.
   * It is allowed to return any value.
   *
   * @remarks
   * This function is not required to respect the constraints passed to it; however,
   * it is generally recommended that, in the presence of ignored constraints, an error
   * or warning message is thrown to minimize runtime confusion.
   *
   * @returns
   * A value which will be injected into the constructor of the service at the location
   * specified by the author of the service.
   */
  extract: (container: ContainerInstance, constraints: ResolutionConstraintFlag) => TInstance;
  eagerType?: undefined;
}

export interface TypeWrapper<
  TIdentifier extends ServiceIdentifier = ServiceIdentifier,
  TInstance = InferServiceType<TIdentifier>,
> extends StampedTypeWrapper {
  /**
   * The type that the identifier eagerly resolves to.
   *
   * @remarks
   * As an example, in the case of a class service "MyService", this would
   * be a reference to "MyService".
   */
  eagerType?: ServiceIdentifier;

  /**
   * Resolve a customised value, which will be injected into the constructor
   * of a service upon its initialisation.
   *
   * This method is called when a service, which has been authored with this TypeWrapper
   * in its list of dependencies, is created by a {@link ContainerInstance}.
   *
   * @param container The container from which the service is being constructed.
   * The presence of the {@link SkipSelf} resolution constraint does not affect
   * the value of this parameter.
   *
   * @param constraints The constraints for this dependency, as specified
   * by the author of the service.
   * If no constraints were specified, this defaults to {@link ResolutionConstraintFlag.None}.
   *
   * @remarks
   * The presence of this method denotes an extractable TypeWrapper, which provides
   * customised handling for the resolution of a service's dependency.
   * It is allowed to return any value.
   *
   * @remarks
   * This function is not required to respect the constraints passed to it; however,
   * it is generally recommended that, in the presence of ignored constraints, an error
   * or warning message is thrown to minimize runtime confusion.
   *
   * @returns
   * A value which will be injected into the constructor of the service at the location
   * specified by the author of the service.
   */
  extract?: (container: ContainerInstance, constraints: ResolutionConstraintFlag) => TInstance;
}
