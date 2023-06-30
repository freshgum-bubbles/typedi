import { Container, ContainerInstance, Token } from '../../src/index';

describe('Container.setValue', function () {
  /**
   * == STOLEN FROM HOST-CONTAINER.SPEC.TS ==
   * We again take a very thorough approach to ensuring all input / environment
   * combinations result in consistent behaviour, and work correctly according to spec.
   *
   * Just to be extra sure it resolves correctly in all situations,
   * we make use of describe.each to run over it being used in three cases:
   *   - The default container
   *   - An orphaned container
   *   - A child container
   */
  describe.each(
    [
      { name: 'Default Container', container: Container },
      { name: 'Orphaned Container', container: ContainerInstance.of(Symbol(), null) },
      { name: 'Child Container', container: Container.ofChild(Symbol()) },
      /** Map each container to test each with a string and a Token. */
    ].flatMap(x => [
      { ...x, id: 'test', idType: 'string' },
      { ...x, id: new Token('test'), idType: 'Token' },
    ])
  )('$name: Container.setValue(<$idType>, ...)', ({ container, id }) => {
    beforeEach(() => container.reset({ strategy: 'resetValue' }));

    const expectedValue = Symbol();

    it('should set a new value in the container', () => {
      expect(() => container.setValue(id, expectedValue)).not.toThrowError();
    });

    it('should make .has return true for the ID', () => {
      container.setValue(id, expectedValue);
      expect(container.has(id)).toStrictEqual(true);
    });

    it('should then be retrievable via .get', () => {
      container.setValue(id, expectedValue);
      expect(container.get(id)).toStrictEqual(expectedValue);
    });

    it('should throw when passed a non-string/Token ID', () => {
      // @ts-expect-error
      expect(() => container.setValue(class {}, 'hello')).toThrowError();
    });
  });
});
