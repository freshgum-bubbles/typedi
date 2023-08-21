import { Container, HostContainer, Token, Service, ContainerInstance } from '../../src/index';
import { defaultContainer } from '../../src/container-instance.class';
import { ContainerConflictDefinition } from '../../src/interfaces/create-container-options.interface';

const getID = () => Symbol('test');

describe('Container creation options', () => {
  it('should reject all conflicts if "rejectAll" is set as the conflict definition', () => {
    const id = getID();

    ContainerInstance.of(id, null);

    expect(() => {
      defaultContainer.ofChild(id, { onConflict: 'throw' });
    }).toThrow();
  });

  it('should allow conflicts if "allowSameParent" is set and the parents match', () => {
    const id = getID();
    let container1 = defaultContainer.ofChild(id);
    let container2!: ContainerInstance;

    expect(() => {
      container2 = defaultContainer.ofChild(id, { conflictDefinition: 'allowSameParent' });
    }).not.toThrow();

    expect(container1).toStrictEqual(container2);
  });

  it('should not fail if options are set and a container does not already exist', () => {
    const id = getID();

    expect(() => {
      defaultContainer.ofChild(id, {
        onConflict: 'throw',
        conflictDefinition: 'rejectAll',
      });
    }).not.toThrow();
  });

  it.each([{ conflictDefinition: 'allowSameParent' }, { conflictDefinition: 'rejectAll' }])(
    'should throw if definition is set to "$conflictDefinition" without a strategy and there is a conflict',
    ({ conflictDefinition }) => {
      const id = getID();

      expect(() => {
        defaultContainer.of(id);
        ContainerInstance.of(id, null, { conflictDefinition: conflictDefinition as ContainerConflictDefinition });
      }).toThrow();
    }
  );

  it('should throw if "allowSameParent" is set and the parents do not match', () => {
    const id = getID();

    expect(() => {
      defaultContainer.of(id);
      ContainerInstance.of(id, null, { conflictDefinition: 'allowSameParent' });
    }).toThrow();
  });

  it('should not throw if a container does not already exist', () => {
    const id = getID();

    expect(() => {
      defaultContainer.of(id, { onConflict: 'throw' });
    }).not.toThrow();
  });

  it('should allow conflicts by default', () => {
    const id = getID();

    expect(() => {
      ContainerInstance.of(id, null);
      defaultContainer.ofChild(id);
    }).not.toThrow();
  });

  it('should allow conflicts if "returnExisting" is passed', () => {
    const id = getID();

    expect(() => {
      // todo: add more expect()s here
      ContainerInstance.of(id, null);
      defaultContainer.ofChild(id, { onConflict: 'returnExisting' });
    }).not.toThrow();
  });

  it('should return null if a conflict arises and strategy is "null"', () => {
    const id = getID();

    ContainerInstance.of(id, null);
    expect(defaultContainer.ofChild(id, { onConflict: 'null' })).toBeNull();
  });

  it('should not return null if the strategy is null and a container does not already exist', () => {
    const id = getID();
    const child = defaultContainer.ofChild(id, { onConflict: 'null' });

    expect(child).not.toBeNull();
    expect(child!.id).toStrictEqual(id);
    expect(child).toBeInstanceOf(ContainerInstance);
  });

  describe('onFree', () => {
    it('should throw if set to "throw" and a container with the ID does not exist', () => {
      const id = getID();
      expect(() => defaultContainer.of(id, { onFree: 'throw' })).toThrow();
    });

    it('should return null if set to "null" and a container with the ID does not exist', () => {
      const id = getID();
      expect(defaultContainer.of(id, { onFree: 'null' })).toBeNull();
    });

    it('should use default behaviour if set to "returnNew"', () => {
      const id = getID();
      const child = defaultContainer.of(id, { onFree: 'returnNew' });

      expect(child).not.toBeNull();
      expect(child.id).toStrictEqual(id);
      expect(child).toBeInstanceOf(ContainerInstance);
    });
  });
});
