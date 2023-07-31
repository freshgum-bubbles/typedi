import { TYPE_WRAPPER } from '../constants/type-wrapper.const.mjs';
import { TransientRefHost } from '../transient-ref-host.class';
import { InferServiceType } from '../types/infer-service-type.type.mjs';
import { ServiceIdentifier } from '../types/service-identifier.type';
import { TypeWrapper } from '../types/type-wrapper.type';

export function TransientRef<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>>(
  subject: TIdentifier
): TypeWrapper<TIdentifier, TransientRefHost<TIdentifier, TInstance>> {
  return {
    $$$: TYPE_WRAPPER,
    eagerType: subject,
    lazyType: () => subject,
    unpack: container => new TransientRefHost(subject, container)
  };
}
