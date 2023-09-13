import { Token } from '../token.class.mjs';
import { ServiceIdentifier } from '../types/service-identifier.type.mjs';

export function normalizeIdentifier(identifier: ServiceIdentifier) {
  let name: string;

  return typeof identifier === 'string'
    ? identifier
    : identifier instanceof Token
    ? `Token<${identifier.name ?? 'UNSET_NAME'}>`
    : ((name = identifier?.name ?? identifier.prototype?.name) && `MaybeConstructable<${name}>`) ??
      '<UNKNOWN_IDENTIFIER>';
}
