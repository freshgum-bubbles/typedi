import { Container } from 'internal:typedi';

/**
 * Create a deep container hierarchy consisting of X levels.
 * Each container is created as a child container of the former.
 *
 * @param levels The number of containers to create.
 * @param root The container to use as the parent of the first child container.
 *
 * @remarks
 * This function is used for ensuring container hierarchy works as expected.
 *
 * @returns
 * A deep container hierarchy.
 */
export function createDeepContainerTree(levels: number, root = Container) {
  let container = root;
  let index = 0;

  while (index <= levels) {
    container = container.ofChild(Symbol());
    index++;
  }

  return container;
}
