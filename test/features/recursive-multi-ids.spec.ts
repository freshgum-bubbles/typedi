import { Container, ContainerInstance, ServiceOptions, Token } from '../../src/index';
import { createArrayOfNumbers } from '../utils/create-array-of-numbers.util';
import { createDeepContainerTree } from '../utils/create-deep-container-tree.util';

describe('Container.getMany', () => {
  beforeEach(() => Container.reset({ strategy: 'resetServices' }));
  const names = ['Joanna', 'Sylvia', 'Michelle'];
  const NAMES = new Token<string>();

  function applyNamesToContainer(container: ContainerInstance, partialOpts?: Partial<ServiceOptions>) {
    for (const name of names) {
      const baseOpts = { id: NAMES, value: name, multiple: true } as const;

      if (partialOpts) {
        Object.assign(baseOpts, partialOpts);
      }

      container.set(baseOpts);
    }
  }

  it('imports values from the default container when the scope is "singleton"', () => {
    const childContainer = Container.ofChild(Symbol());
    applyNamesToContainer(childContainer, { scope: 'singleton' });

    expect(childContainer.getMany(NAMES)).toEqual(names);
  });

  it('does not import values from the default container when the scope is "singleton", and the container is orphaned', () => {
    const orphanedContainer = ContainerInstance.of(Symbol(), null);
    applyNamesToContainer(orphanedContainer, { scope: 'singleton' });

    expect(() => orphanedContainer.getMany(NAMES)).toThrowError();
    expect(Container.getMany(NAMES)).toMatchObject(names);
  });

  it.each(createArrayOfNumbers(15))('should deeply inherit services where depth is %i', number => {
    applyNamesToContainer(Container);
    const deepChildContainer = createDeepContainerTree(number, Container);
    expect(deepChildContainer.getManyOrNull(NAMES)).toEqual(names);
  });

  it('deals with transient services correctly', () => {});
});
