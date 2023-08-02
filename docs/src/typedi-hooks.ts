import { Container, ServiceIdentifier, ContainerIdentifier } from '@freshgum/typedi';
import { useMemo } from 'react';

export function useService<T>(id: ServiceIdentifier, container = Container) {
  const value = useMemo(() => container.getOrNull(id), [id]);

  return [value as T] as const;
}

export function useContainer(id: ContainerIdentifier) {
  const value = useMemo(() => Container.ofChild(id), [id]);

  return [value] as const;
}
