export function createFakeClassDecoratorContext<TFunction extends Function>(
  targetConstructor: TFunction
): ClassDecoratorContext<abstract new (...args: any) => any> {
  return {
    addInitializer(initializer) {
      // We can't implement this, and it isn't used by ESService.
      throw new Error('Not implemented.');
    },
    kind: 'class',
    // TODO: Not sure what goes here, and it isn't used by ESService.
    metadata: {},
    name: targetConstructor.name,
  };
}
