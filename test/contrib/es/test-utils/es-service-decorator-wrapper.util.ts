import { ServiceOptions, AnyServiceDependency, Service, Constructable } from 'internal:typedi';
import { ESService } from 'internal:typedi/contrib/es/es-service.decorator.mjs';
import { createFakeClassDecoratorContext } from './fake-context.util';

// To simplify the implementation, we don't define *each* applicable overload
// here.  Instead, we define just the implementation and cast the wrapper to
// <typeof Service>.
function WrappedESServiceDecoratorImpl<T extends { new (): TReturn }, TReturn>(
  optionsOrDependencies: Omit<ServiceOptions<T>, 'dependencies'> | ServiceOptions<T> | AnyServiceDependency[],
  maybeDependencies?: AnyServiceDependency[]
): { (t: T): void } {
  return <TTarget extends T>(targetConstructor: TTarget) => {
    const fakeContext: ClassDecoratorContext = createFakeClassDecoratorContext(targetConstructor);

    // Note: These aren't guaranteed, just used to trick TypeScript into being quiet.
    ESService<T>(
      optionsOrDependencies as Omit<ServiceOptions<T>, 'dependencies'>,
      maybeDependencies as AnyServiceDependency[]
    )(targetConstructor, fakeContext);
  };
}

export const WrappedESServiceDecorator = WrappedESServiceDecoratorImpl as typeof Service;
