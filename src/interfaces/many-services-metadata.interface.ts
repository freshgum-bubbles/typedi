import { Token } from '../token.class';
import { ContainerScope } from '../types/container-scope.type';

export interface ManyServicesMetadata {
  tokens: Token<unknown>[];
  scope: ContainerScope;
}
