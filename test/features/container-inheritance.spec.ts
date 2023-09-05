import { Container, Token } from '../../src/index';
import { createArrayOfNumbers } from '../utils/create-array-of-numbers.util';

describe('Child Containers', () => {
  function createDeepContainerTree(levels: number, root = Container) {
    let container = root;
    let index = 0;

    while (index <= levels) {
      container = container.ofChild(Symbol());
      index++;
    }

    return container;
  }

  describe('Container Inheritance', () => {
    it.each(createArrayOfNumbers(15))('should deeply inherit services where depth is %i', number => {
      const NAME = new Token<string>();
      const name = 'Joanna';

      Container.setValue(NAME, name);
      const deepChildContainer = createDeepContainerTree(number);

      expect(deepChildContainer.has(NAME)).toStrictEqual(true);
      expect(deepChildContainer.getOrNull(NAME)).toStrictEqual(name);
    });
  });
});
