import { Container, ContainerInstance, ServiceOptions, Token } from "../../src/index";
import { createArrayOfNumbers } from "../utils/create-array-of-numbers.util";
import { createDeepContainerTree } from "../utils/create-deep-container-tree.util";

describe('Container.getMany', () => {
    
    beforeEach(() => Container.reset({ strategy: 'resetServices' }));
    const names = ['Joanna', 'Sylvia', 'Michelle'];
    const NAME = new Token<string>();

    function applyNamesToContainer (container: ContainerInstance, partialOpts?: Partial<ServiceOptions>) {
        names.forEach(name => container.set({ id: NAME, value: name, multiple: true, ...(partialOpts ?? {}) }));

        for (const name of names) {
            const baseOpts = { id: NAME, value: name, multiple: true } as const;

            if (partialOpts) {
                Object.assign(baseOpts, partialOpts);
            }

            container.set(baseOpts);
        }
    }

    it('imports values from the default container when the scope is "singleton"', () => {
        const childContainer = Container.ofChild(Symbol());
        applyNamesToContainer(childContainer, { scope: 'singleton' });

        expect(childContainer.getMany(NAME)).toEqual(names);
    });

    it('imports values from the default container when the scope is "singleton", and the container is orphaned', () => {
        const orphanedContainer = ContainerInstance.of(Symbol(), null);
        applyNamesToContainer(orphanedContainer, { scope: 'singleton' });

        expect(orphanedContainer.getMany(NAME)).toEqual(names);
    });
    
    it.each(createArrayOfNumbers(15))('should deeply inherit services where depth is %i', number => {
        applyNamesToContainer(Container);
        const deepChildContainer = createDeepContainerTree(number);
        expect(deepChildContainer.getManyOrNull(NAME)).toEqual(names);
    });
});
