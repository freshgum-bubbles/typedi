import { ContainerInstance, Container, ContainerIdentifier } from 'internal:typedi';
import { ContainerRegistry } from 'internal:typedi/container-registry.class.mjs';
import { createRandomUid } from './utils/create-random-name.util';

describe('ContainerRegistry', () => {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  describe('new ContainerInstance(...)', () => {
    it('should not register the container in the registry', () => {
      class ContainerTest extends ContainerInstance {
        public constructor(id: ContainerIdentifier, parent?: ContainerInstance | undefined) {
          super(id, parent);
        }
      }

      const container = new ContainerTest(Symbol());
      expect(ContainerRegistry.hasContainer(container.id)).toBe(false);
    });
  });

  describe('ContainerRegistry.registerContainer', () => {
    it('should not allow re-registering the default container', () => {
      class FakeContainer extends ContainerInstance {
        constructor() {
          super('default');
        }
      }

      const container = new FakeContainer();
      expect(() => ContainerRegistry.registerContainer(container)).toThrow();
    });

    it('should not allow non-ContainerInstance values', () => {
      expect(() => ContainerRegistry.registerContainer(2 as any)).toThrow();
    });

    it('should not allow conflicting container IDs', () => {
      const fooContainer = Container.of(Symbol());

      /** The first call should fail too, as .of registers the container in the registry. */
      expect(() => ContainerRegistry.registerContainer(fooContainer)).toThrow();
      expect(() => ContainerRegistry.registerContainer(fooContainer)).toThrow();
    });

    it('should not allow conflicting string container IDs', () => {
      // Make the ContainerInstance constructor public for use below.
      class MyContainer extends ContainerInstance {
        public constructor(id: ContainerIdentifier) {
          super(id);
        }
      }

      const NAME = createRandomUid();

      const myContainer1 = new MyContainer(NAME);
      const myContainer2 = new MyContainer(NAME);
      expect(() => ContainerRegistry.registerContainer(myContainer1)).not.toThrowError();
      expect(() => ContainerRegistry.registerContainer(myContainer2)).toThrowError();
    });

    it('should allow unique IDs', () => {
      class FakeContainer extends ContainerInstance {
        constructor() {
          super('CR.RC-2');
        }
      }

      const container = new FakeContainer();
      expect(() => ContainerRegistry.registerContainer(container)).not.toThrow();
      expect(() => ContainerRegistry.registerContainer(container)).toThrow();
    });
  });

  describe('ContainerRegistry.hasContainer', () => {
    it('should return false if the container does not exist', () => {
      expect(ContainerRegistry.hasContainer('nope')).toBe(false);
    });

    it('should return true if a container has been registered', () => {
      const NAME = 'CR.HC-1';

      Container.of(NAME);
      expect(ContainerRegistry.hasContainer(NAME)).toBe(true);
    });

    it('should always return true for "default"', () => {
      expect(ContainerRegistry.hasContainer('default')).toBe(true);
    });
  });

  describe('ContainerRegistry.getContainer', () => {
    it('should return the container with the given ID', () => {
      const NAME = 'CR.GC-1';
      const newContainer = Container.of(NAME);

      expect(() => ContainerRegistry.getContainer(NAME)).not.toThrow();
      expect(ContainerRegistry.getContainer(NAME)).toStrictEqual(newContainer);
    });

    it('should throw for non-existent IDs', () => {
      expect(() => ContainerRegistry.getContainer('NOPE')).toThrow();
    });
  });

  describe('ContainerRegistry.removeContainer', () => {
    it('should not allow removing an unknown container', () => {
      class FakeContainer extends ContainerInstance {
        constructor() {
          super('NOPE');
        }
      }

      const container = new FakeContainer();
      expect(ContainerRegistry.removeContainer(container)).rejects.toBeInstanceOf(Error);
    });

    it('should not reject when the container is known', () => {
      const newContainer = Container.of('CS.RC-3');

      expect(ContainerRegistry.removeContainer(newContainer)).resolves.toBeUndefined();
    });

    it('should not dispose already-disposed containers', async () => {
      const newContainer = Container.of(Symbol());
      const disposeSpy = jest.spyOn(newContainer, 'dispose');

      await newContainer.dispose();
      await ContainerRegistry.removeContainer(newContainer);

      // We already called "dispose" after the spy was set up, so expect only one call.
      expect(disposeSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a promise', () => {
      const newContainer = Container.of('CS.RC-4');

      expect(ContainerRegistry.removeContainer(newContainer)).toBeInstanceOf(Promise);
    });

    it('should call the container\'s "dispose" function', () => {
      const fakeDispose = jest.fn();
      fakeDispose.mockReturnValue(Promise.resolve());

      class FakeContainer extends ContainerInstance {
        constructor() {
          super('CS-RC-4');
          ContainerRegistry.registerContainer(this);
        }

        dispose = fakeDispose;
      }

      const fakeContainer = new FakeContainer();
      expect(ContainerRegistry.removeContainer(fakeContainer)).resolves.toBe(undefined);
      expect(fakeDispose).toBeCalledTimes(1);
    });

    it('should wait for the container\'s "dispose" function', () => {
      const fakeDispose = jest.fn();
      let resolve_!: Function,
        resolved = false;

      fakeDispose.mockReturnValue(
        new Promise(resolve => {
          resolve_ = (x: any) => {
            resolve(x);
            resolved = true;
          };
        })
      );

      class FakeContainer extends ContainerInstance {
        constructor() {
          super('CS-RC-5');
          ContainerRegistry.registerContainer(this);
        }

        dispose = fakeDispose;
      }

      const fakeContainer = new FakeContainer();

      let removePromise = ContainerRegistry.removeContainer(fakeContainer);

      /** Hacky way to check if the promise has resolved: */
      expect(Promise.race([Promise.resolve('pending'), removePromise])).resolves.toStrictEqual('pending');

      resolve_();

      expect(removePromise).resolves.toBeUndefined();
    });

    it('should throw when called twice, even on a previously-known container', () => {
      const container = Container.of('CS.RC-6');

      expect(ContainerRegistry.removeContainer(container)).resolves.toBe(undefined);
      expect(ContainerRegistry.removeContainer(container)).rejects.toThrow();
    });

    it('should immediately remove the container before waiting for dispose', () => {
      const NAME = 'CS.RC-7';
      const mockDispose = jest.fn();

      /** Set the return value to never resolve. */
      mockDispose.mockReturnValue(new Promise(() => {}));

      class FakeContainer extends ContainerInstance {
        constructor() {
          super(NAME);
        }
      }

      const container = new FakeContainer();
      ContainerRegistry.registerContainer(container);

      expect(ContainerRegistry.removeContainer(container)).resolves.toBeUndefined();
      expect(ContainerRegistry.hasContainer(NAME)).toBe(false);
      expect(ContainerRegistry.removeContainer(container)).rejects.toBeInstanceOf(Error);
    });

    it('should remove the container from the registry', () => {
      const NAME = 'CS.RC-8';
      const newContainer = Container.of(NAME);

      expect(() => ContainerRegistry.removeContainer(newContainer)).not.toThrow();
      expect(ContainerRegistry.hasContainer(NAME)).toBe(false);
    });
  });
});
