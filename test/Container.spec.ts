import 'reflect-metadata';
import { Container, ContainerInstance, ServiceIdentifier, ServiceMetadata } from '../src/index';
import { Service } from '../src/decorators/service.decorator';
import { Token } from '../src/token.class';
import { ServiceNotFoundError } from '../src/error/service-not-found.error';
import { ContainerRegistry } from '../src/container-registry.class';
import { Disposable } from '../src/types/disposable.type';

describe('Container', function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should implement Disposable', () => {
    const tempContainer = Container.of('disposable');
    const asDisposable: Disposable = tempContainer;

    /** Ensure the variable, and thus its type check, does not get elided by the compiler. */
    if (asDisposable) { expect(true).toBe(true); }

    expect(tempContainer).toHaveProperty('dispose');
    expect(tempContainer).toHaveProperty('disposed');
  });

  describe('get', () => {
    it('should be able to get a boolean', () => {
      const booleanTrue = 'boolean.true';
      const booleanFalse = 'boolean.false';
      Container.set({ id: booleanTrue, value: true, dependencies: [] });
      Container.set({ id: booleanFalse, value: false, dependencies: [] });

      expect(Container.get(booleanTrue)).toBe(true);
      expect(Container.get(booleanFalse)).toBe(false);
    });

    it('should be able to get an empty string', () => {
      const emptyString = 'emptyString';
      Container.set({ id: emptyString, value: '', dependencies: [] });

      expect(Container.get(emptyString)).toBe('');
    });

    it('should be able to get the 0 number', () => {
      const zero = 'zero';
      Container.set({ id: zero, value: 0, dependencies: [] });

      expect(Container.get(zero)).toBe(0);
    });
  });

  describe('set', function () {
    it('should be able to set a class into the container', function () {
      class TestService {
        constructor(public name: string) { }
      }
      const testService = new TestService('this is test');
      Container.set({ id: TestService, value: testService, dependencies: [] });
      expect(Container.get(TestService)).toBe(testService);
      expect(Container.get(TestService).name).toBe('this is test');
    });

    it('should be able to set a named service', function () {
      class TestService {
        constructor(public name: string) { }
      }
      const firstService = new TestService('first');
      Container.set({ id: 'first.service', value: firstService, dependencies: [String] });

      const secondService = new TestService('second');
      Container.set({ id: 'second.service', value: secondService, dependencies: [String] });

      expect(Container.get<TestService>('first.service').name).toBe('first');
      expect(Container.get<TestService>('second.service').name).toBe('second');
    });

    it('should be able to set a tokenized service', function () {
      class TestService {
        constructor(public name: string) { }
      }
      const FirstTestToken = new Token<TestService>();
      const SecondTestToken = new Token<TestService>();

      const firstService = new TestService('first');
      Container.set({ id: FirstTestToken, value: firstService, dependencies: [] });

      const secondService = new TestService('second');
      Container.set({ id: SecondTestToken, value: secondService, dependencies: [] });

      expect(Container.get(FirstTestToken).name).toBe('first');
      expect(Container.get(SecondTestToken).name).toBe('second');
    });

    it('should override previous value if service is written second time', function () {
      class TestService {
        constructor(public name: string) { }
      }
      const TestToken = new Token<TestService>();

      const firstService = new TestService('first');
      Container.set({ id: TestToken, value: firstService, dependencies: [String] });
      expect(Container.get(TestToken)).toBe(firstService);
      expect(Container.get(TestToken).name).toBe('first');

      const secondService = new TestService('second');
      Container.set({ id: TestToken, value: secondService, dependencies: [String] });

      expect(Container.get(TestToken)).toBe(secondService);
      expect(Container.get(TestToken).name).toBe('second');
    });
  });

  describe('set multiple', function () {
    it('should be able to provide a list of values', function () {
      class TestService { }

      class TestServiceFactory {
        create() {
          return 'test3-service-created-by-factory';
        }
      }

      const testService = new TestService();
      const test1Service = new TestService();
      const test2Service = new TestService();

      Container.set({ id: TestService, value: testService, dependencies: [] });
      Container.set({ id: 'test1-service', value: test1Service, dependencies: [] });
      Container.set({ id: 'test2-service', value: test2Service, dependencies: [] });
      Container.set({ id: 'test3-service', factory: [TestServiceFactory, 'create'], dependencies: [] });

      expect(Container.get(TestService)).toBe(testService);
      expect(Container.get<TestService>('test1-service')).toBe(test1Service);
      expect(Container.get<TestService>('test2-service')).toBe(test2Service);
      expect(Container.get<string>('test3-service')).toBe('test3-service-created-by-factory');
    });
  });

  describe('remove', function () {
    it('should be able to remove previously registered services', function () {
      class TestService {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        constructor() { }
      }

      const testService = new TestService();
      const test1Service = new TestService();
      const test2Service = new TestService();

      Container.set({ id: TestService, value: testService, dependencies: [] });
      Container.set({ id: 'test1-service', value: test1Service, dependencies: [] });
      Container.set({ id: 'test2-service', value: test2Service, dependencies: [] });

      expect(Container.get(TestService)).toBe(testService);
      expect(Container.get<TestService>('test1-service')).toBe(test1Service);
      expect(Container.get<TestService>('test2-service')).toBe(test2Service);

      Container.remove(['test1-service', 'test2-service']);

      expect(Container.get(TestService)).toBe(testService);
      expect(() => Container.get<TestService>('test1-service')).toThrow(ServiceNotFoundError);
      expect(() => Container.get<TestService>('test2-service')).toThrow(ServiceNotFoundError);
    });
  });

  describe('reset', function () {
    it('should support container reset', () => {
      @Service([])
      class TestService {
        constructor(public name: string = 'frank') { }
      }

      Container.set({ id: TestService, type: TestService, dependencies: [] });
      const testService = Container.get(TestService);
      testService.name = 'john';

      expect(Container.get(TestService)).toBe(testService);
      expect(Container.get(TestService).name).toBe('john');
      Container.reset({ strategy: 'resetValue' });
      expect(Container.get(TestService)).not.toBe(testService);
      expect(Container.get(TestService).name).toBe('frank');
    });
  });

  describe('set with ServiceMetadata passed', function () {
    it('should support factory functions', function () {
      class Engine {
        public serialNumber = 'A-123';
      }

      class Car {
        constructor(public engine: Engine) { }
      }

      Container.set({
        id: Car,
        factory: () => new Car(new Engine()),
        dependencies: [Engine]
      });

      expect(Container.get(Car).engine.serialNumber).toBe('A-123');
    });

    it('should support factory classes', function () {
      @Service([])
      class Engine {
        public serialNumber = 'A-123';
      }

      class Car {
        constructor(public engine: Engine) { }
      }

      @Service([Engine])
      class CarFactory {
        constructor(private engine: Engine) { }

        createCar(): Car {
          return new Car(this.engine);
        }
      }

      Container.set({
        id: Car,
        factory: [CarFactory, 'createCar'],
        dependencies: [Engine]
      });

      expect(Container.get(Car).engine.serialNumber).toBe('A-123');
    });

    it('should support tokenized services from factories', function () {
      interface Vehicle {
        getColor(): string;
      }

      class Bus implements Vehicle {
        getColor(): string {
          return 'yellow';
        }
      }

      class VehicleFactory {
        createBus(): Vehicle {
          return new Bus();
        }
      }

      const VehicleService = new Token<Vehicle>();

      Container.set({
        id: VehicleService,
        factory: [VehicleFactory, 'createBus'],
        dependencies: []
      });

      expect(Container.get(VehicleService).getColor()).toBe('yellow');
    });
  });

  describe('Container.reset', () => {
    it('should call dispose function on removed service', () => {
      const destroyFnMock = jest.fn();
      const destroyPropertyFnMock = jest.fn();
      @Service([])
      class MyServiceA {
        dispose() {
          destroyFnMock();
        }
      }

      @Service([])
      class MyServiceB {
        public dispose = destroyPropertyFnMock;
      }

      const instanceAOne = Container.get(MyServiceA);
      const instanceBOne = Container.get(MyServiceB);

      Container.reset({ strategy: 'resetValue' });

      const instanceATwo = Container.get(MyServiceA);
      const instanceBTwo = Container.get(MyServiceB);

      expect(destroyFnMock).toHaveBeenCalledTimes(1);
      expect(destroyPropertyFnMock).toHaveBeenCalledTimes(1);

      expect(instanceAOne).toBeInstanceOf(MyServiceA);
      expect(instanceATwo).toBeInstanceOf(MyServiceA);
      expect(instanceBOne).toBeInstanceOf(MyServiceB);
      expect(instanceBTwo).toBeInstanceOf(MyServiceB);

      expect(instanceAOne).not.toBe(instanceATwo);
      expect(instanceBOne).not.toBe(instanceBTwo);
    });

    it('should be able to destroy services without destroy function', () => {
      @Service([])
      class MyService { }

      const instanceA = Container.get(MyService);

      Container.reset({ strategy: 'resetValue' });

      const instanceB = Container.get(MyService);

      expect(instanceA).toBeInstanceOf(MyService);
      expect(instanceB).toBeInstanceOf(MyService);
      expect(instanceA).not.toBe(instanceB);
    });
  });

  describe('Container.remove', () => {
    it('should call dispose function on removed service', () => {
      const destroyFnMock = jest.fn();
      const destroyPropertyFnMock = jest.fn();
      @Service([])
      class MyServiceA {
        dispose() {
          destroyFnMock();
        }
      }

      @Service([])
      class MyServiceB {
        public dispose = destroyPropertyFnMock();
      }

      Container.get(MyServiceA);
      Container.get(MyServiceB);

      expect(() => Container.remove(MyServiceA)).not.toThrow();
      expect(() => Container.remove(MyServiceB)).not.toThrow();

      expect(destroyFnMock).toHaveBeenCalledTimes(1);
      expect(destroyPropertyFnMock).toHaveBeenCalledTimes(1);

      expect(() => Container.get(MyServiceA)).toThrow(ServiceNotFoundError);
      expect(() => Container.get(MyServiceB)).toThrow(ServiceNotFoundError);
    });

    it('should be able to destroy services without destroy function', () => {
      @Service([])
      class MyService { }

      Container.get(MyService);

      expect(() => Container.remove(MyService)).not.toThrow();
      expect(() => Container.get(MyService)).toThrow(ServiceNotFoundError);
    });
  });

  describe('Container.getOrNull', () => {
    it('either returns the resolved identifier or null', () => {
      /** The service isn't decorated with `@Service` to make it unknown to the injector. */
      class UnknownService { }

      expect(Container.has(UnknownService)).toStrictEqual(false);
      expect(Container.getOrNull(UnknownService)).toStrictEqual(null);
      expect(Container.getOrNull(class { })).toStrictEqual(null);
    });
  });

  describe('Container.getManyOrNull', () => {
    it('should return null when the identifier cannot be resolved', () => {
      /** The service isn't decorated with `@Service` to make it unknown to the injector. */
      class UnknownService { }

      expect(Container.has(UnknownService)).toStrictEqual(false);
      expect(Container.getManyOrNull(UnknownService)).toStrictEqual(null);
      expect(Container.getManyOrNull(class { })).toStrictEqual(null);
    });

    it('should return the instances when the identifier can be resolved', () => {
      @Service({ multiple: true }, [])
      class AwesomeService {
        getValue () {
          return 42;
        }
      }

      expect(Container.has(AwesomeService)).toStrictEqual(true);
      expect(Container.getManyOrNull(AwesomeService)).not.toBe(null);
      expect(Container.getManyOrNull(AwesomeService)![0].getValue()).toStrictEqual(42);
    });
  });

  describe('Container.ofChild', () => {
    it('should not attach new symbols to parents, and should resolve as expected', () => {
      const fooContainer = Container.ofChild('ofChild');

      @Service({ container: fooContainer }, [])
      class ValueService {
        getValue() {
          return 42;
        }
      }

      expect(Container.has(ValueService)).toStrictEqual(false);
      expect(fooContainer.has(ValueService)).toStrictEqual(true);
      expect(fooContainer.get(ValueService).getValue()).toStrictEqual(42);
    });

    it('should have its parent property set to the parent', () => {
      const fooContainer = Container.ofChild('ofChild-2');
      expect(fooContainer).not.toBe(null);
      expect(fooContainer.parent).toStrictEqual(Container);
    });
  });

  describe('Container.of', () => {
    it('should create a new container or return existing with given ID', () => {
      const NAME = 'Container.of-1';
      const child = Container.ofChild(NAME);
      expect(child).not.toBe(null);
      expect(child.id).toStrictEqual(NAME);
    });

    it('should also have a functional static equivalent', () => {
      const NAME = 'Container.of-2';
      const container = ContainerInstance.of(NAME);

      expect(container).not.toBe(null);
      expect(container.id).toStrictEqual(NAME);
    });

    it('should return the default container when "default" is passed', () => {
      const NAME = 'default';
      const container = Container.of('default');

      expect(container).not.toBe(null);
      expect(container).toStrictEqual(Container);
    });

    it('should register the container in ContainerRegistry', () => {
      const NAME = 'Container.of-3';
      Container.of(NAME);

      expect(ContainerRegistry.hasContainer(NAME)).toBe(true);
    });
  });

  describe('Container.defaultContainer', () => {
    it('should not be null', () => {
      expect(ContainerInstance.defaultContainer).toBeTruthy();
    });

    it('should be of type ContainerInstance', () => {
      expect(ContainerInstance.defaultContainer).toBeInstanceOf(ContainerInstance);
    });
  });

  describe('Container.disposed', () => {
    it('should initially be false', () => {
      expect(ContainerInstance.defaultContainer).toHaveProperty('disposed', false);
      expect(Container.of('random')).toHaveProperty('disposed', false);
    });
  });

  describe('Container.dispose', () => {
    it('should return a promise', () => {
      const tempContainer = Container.of(Symbol());
      expect(tempContainer.dispose()).toBeInstanceOf(Promise);
    });

    it('should make all methods throw except .of', () => {
      const tempContainer = Container.of(Symbol());

      /** Create a fake identifier that will never resolve for testing. */
      class MyService {}
      
      expect(tempContainer.dispose()).resolves.toBeUndefined();

      /** Test all methods on the injector. */
      expect(() => tempContainer.get(MyService)).toThrow();
      expect(() => tempContainer.getMany(MyService)).toThrow();
      expect(() => tempContainer.getManyOrNull(MyService)).toThrow();
      expect(() => tempContainer.getOrNull(MyService)).toThrow();
      expect(() => tempContainer.has(MyService)).toThrow();
      expect(() => tempContainer.ofChild(Symbol())).toThrow();
      expect(() => tempContainer.remove(MyService)).toThrow();
      expect(() => tempContainer.reset({ strategy: 'resetServices' })).toThrow();
      expect(() => tempContainer.set({ dependencies: [], type: MyService })).toThrow();

      expect(tempContainer.of(Symbol())).toBeInstanceOf(ContainerInstance);
    });

    it.skip('should reset services', () => {

    });

    it('should throw an error if the container is already disposed', () => {
      const tempContainer = Container.of(Symbol());

      expect(tempContainer.dispose()).resolves.toBeUndefined();
      expect(tempContainer.dispose()).rejects.toBeInstanceOf(Error);
    });

    it('should set the disposed property to true', () => {
      const tempContainer = Container.of(Symbol());

      expect(tempContainer.dispose()).resolves.toBeUndefined();
      expect(tempContainer).toHaveProperty('disposed', true);
    });
  });

  describe('Container[Symbol.iterator]', () => {
    it('should be present on the interface', () => {
      expect(ContainerInstance.defaultContainer[Symbol.iterator]).not.toBeUndefined();
      expect(ContainerInstance.defaultContainer[Symbol.iterator]).toEqual(expect.any(Function));
    });

    it('should return an iterator', () => {
      const iterator = ContainerInstance.defaultContainer[Symbol.iterator]();

      expect(typeof iterator.next).toStrictEqual('function');
    });

    it('should allow iteration of the container', () => {
      const tempContainer = Container.of(Symbol());
      
      @Service({ container: tempContainer }, [])
      class MyService {}

      tempContainer.set({ id: 'a', type: MyService, dependencies: [ ] });
      tempContainer.set({ id: 'b', type: MyService, dependencies: [ ] });
      tempContainer.set({ id: 'c', type: MyService, dependencies: [ ] });

      const items = [...tempContainer];
      const itemsAsListOfIDs = items.map(([id]) => id);
      
      /** Ensure the type of the items is correct. */
      expect(items).toContain<ServiceMetadata<unknown>>;
      expect(itemsAsListOfIDs).toContain<ServiceIdentifier>;

      /** Is dynamically calling expect fine? Should be, this is a static array. */
      ['a', 'b', 'c'].forEach(identifier => {
        expect(itemsAsListOfIDs).toContainEqual(identifier);
      });
    });
  });
});
