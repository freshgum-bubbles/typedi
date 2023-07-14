import { ContainerInstance } from '../container-instance.class';
import { CreateContainerOptions } from '../interfaces/create-container-options.interface';

export type CreateContainerResult<T extends CreateContainerOptions> = T['onConflict'] extends 'null'
  ? null | ContainerInstance
  : T['onFree'] extends 'null'
  ? null | ContainerInstance
  : ContainerInstance;
