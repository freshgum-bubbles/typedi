import { ContainerInstance } from '../container-instance.class.mts';
import { CreateContainerOptions } from '../interfaces/create-container-options.interface.mts';

export type CreateContainerResult<T extends CreateContainerOptions> = T['onConflict'] extends 'null'
  ? null | ContainerInstance
  : T['onFree'] extends 'null'
  ? null | ContainerInstance
  : ContainerInstance;
