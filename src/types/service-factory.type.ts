import { ContainerInstance } from '../container-instance.class';
import { DependencyDescriptor } from '../interfaces/dependency-descriptor.interface';
import { ServiceIdentifier } from './service-identifier.type';

/**
 * A factory which creates an instance of a service.
 * 
 * @example
 * Here is an example:
 * ```ts
 * @Service({
 *   factory: () => new GreeterService('Joanna')
 * }, [String])
 * export class GreeterService {
 *   constructor (private subject: string) { } 
 * }
 * ```
 */
export type ServiceFactory<T = unknown> = (
  container: ContainerInstance,
  id: ServiceIdentifier,
  parameters: DependencyDescriptor[]
) => T;
