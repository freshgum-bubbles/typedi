import { ContainerInstance } from '../container-instance.class.mjs';
import { InferServiceType } from './infer-service-type.type.mjs';
import { ResolutionConstraintFlag } from './resolution-constraint.type.mjs';
import { ServiceIdentifier } from './service-identifier.type.mjs';

export interface TypeWrapper<TIdentifier extends ServiceIdentifier = ServiceIdentifier, TInstance = InferServiceType<TIdentifier>> {
  /**
   * Choose a really random identifier that pretty much nobody is going to use.
   * We need to do this as, if we don't, {@link isTypeWrapper} might return true
   * for values which aren't actually of type TypeWrapper.
   * 
   * The "symbol" referenced here is {@link TYPE_WRAPPER}, which acts as
   * a stamp to allow us to duck-type checks for TypeWrapper objects instead of
   * checking each member (lazyType, eagerType, etc.), which would cause drops
   * in runtime performance.
   */
  readonly $$$: symbol;

  eagerType?: ServiceIdentifier | undefined;
  lazyType: () => TIdentifier;
  unpack?: (container: ContainerInstance, constraints: ResolutionConstraintFlag) => TInstance;
}
