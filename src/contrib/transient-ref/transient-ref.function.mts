import { TYPE_WRAPPER, TypeWrapperStamp } from '../../constants/type-wrapper.const.mjs';
import { TransientRefHost } from './transient-ref-host.class.mjs';
import { InferServiceType } from '../../types/infer-service-type.type.mjs';
import { ServiceIdentifier } from '../../types/service-identifier.type.mjs';
import { TypeWrapper } from '../../types/type-wrapper.type.mjs';

export function TransientRef<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>>(
  subject: TIdentifier
): TypeWrapper<TIdentifier, TransientRefHost<TIdentifier, TInstance>> {
  return {
    [TYPE_WRAPPER]: TypeWrapperStamp.Generic,
    eagerType: subject,
    lazyType: () => subject,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- The argument is not unsafe.
    extract: (container, constraints) => new TransientRefHost(subject, container, constraints),
  };
}