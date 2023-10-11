import { Container, ContainerInstance, Service, Token } from 'internal:typedi';
import { TypedService } from '../contrib/typed-service/typed-service.decorator.mjs';

/**
 * We duplicate the Service test suite for both the {@link Service} and {@link TypedService}
 * decorators to ensure that they have the *exact* same mechanics, quirks and functionality.
 */
describe.each([
  { name: 'TypedService', decorator: TypedService },
  { name: 'Service', decorator: Service },
])('$name decorator', ({ decorator: baseDecorator }) => {
  /** Casting here avoids a compilation error. */
  const decorator = baseDecorator as typeof Service;

  beforeEach(() => Container.reset({ strategy: 'resetServices' }));

  it('should register class in the container, and its instance should be retrievable', function () {
    @decorator([])
    class TestService {}
    @decorator({ id: 'super.service' }, [])
    class NamedService {}
    expect(Container.get(TestService)).toBeInstanceOf(TestService);
    expect(Container.get(TestService)).not.toBeInstanceOf(NamedService);
  });

  it('should register class in the container with given name, and its instance should be retrievable', function () {
    @decorator([])
    class TestService {}
    @decorator({ id: 'super.service' }, [])
    class NamedService {}
    expect(Container.get('super.service')).toBeInstanceOf(NamedService);
    expect(Container.get('super.service')).not.toBeInstanceOf(TestService);
  });

  it('should register class in the container, and its parameter dependencies should be properly initialized', function () {
    @decorator([])
    class TestService {}
    @decorator([])
    class SecondTestService {}
    @decorator([TestService, SecondTestService])
    class TestServiceWithParameters {
      constructor(
        public testClass: TestService,
        public secondTest: SecondTestService
      ) {}
    }
    expect(Container.get(TestServiceWithParameters)).toBeInstanceOf(TestServiceWithParameters);
    expect(Container.get(TestServiceWithParameters).testClass).toBeInstanceOf(TestService);
    expect(Container.get(TestServiceWithParameters).secondTest).toBeInstanceOf(SecondTestService);
  });

  it('should support factory functions', function () {
    @decorator([])
    class Engine {
      constructor(public serialNumber: string) {}
    }

    function createCar() {
      return new Car('BMW', new Engine('A-123'));
    }

    @decorator({ factory: createCar }, [String, Engine])
    class Car {
      constructor(
        public name: string,
        public engine: Engine
      ) {}
    }

    expect(Container.get(Car).name).toBe('BMW');
    expect(Container.get(Car).engine.serialNumber).toBe('A-123');
  });

  it('should support factory classes', function () {
    @decorator([])
    class Engine {
      public serialNumber = 'A-123';
    }

    @decorator([Engine])
    class CarFactory {
      constructor(public engine: Engine) {}

      createCar() {
        return new Car('BMW', this.engine);
      }
    }

    @decorator({ factory: [CarFactory, 'createCar'] }, [String, Engine])
    class Car {
      name: string;
      constructor(
        name: string,
        public engine: Engine
      ) {
        this.name = name;
      }
    }

    expect(Container.get(Car).name).toBe('BMW');
    expect(Container.get(Car).engine.serialNumber).toBe('A-123');
  });

  it('should support factory function with arguments', function () {
    @decorator([])
    class Engine {
      public type = 'V8';
    }

    @decorator([Engine])
    class CarFactory {
      createCar(engine: Engine) {
        engine.type = 'V6';
        return new Car(engine);
      }
    }

    @decorator({ factory: [CarFactory, 'createCar'] }, [Engine])
    class Car {
      constructor(public engine: Engine) {}
    }

    expect(Container.get(Car).engine.type).toBe('V6');
  });

  it('should support transient services', function () {
    @decorator([])
    class Car {
      public serial = Math.random();
    }

    @decorator({ scope: 'transient' }, [])
    class Engine {
      public serial = Math.random();
    }

    const car1Serial = Container.get(Car).serial;
    const car2Serial = Container.get(Car).serial;
    const car3Serial = Container.get(Car).serial;

    const engine1Serial = Container.get(Engine).serial;
    const engine2Serial = Container.get(Engine).serial;
    const engine3Serial = Container.get(Engine).serial;

    expect(car1Serial).toBe(car2Serial);
    expect(car1Serial).toBe(car3Serial);

    expect(engine1Serial).not.toBe(engine2Serial);
    expect(engine2Serial).not.toBe(engine3Serial);
    expect(engine3Serial).not.toBe(engine1Serial);
  });

  it('should support global services', function () {
    @decorator([])
    class Engine {
      public name = 'sporty';
    }

    @decorator({ scope: 'singleton' }, [])
    class Car {
      public name = 'SportCar';
    }

    const globalContainer = Container;
    const scopedContainer = Container.of('enigma');

    expect(globalContainer.get(Car).name).toBe('SportCar');
    expect(scopedContainer.get(Car).name).toBe('SportCar');

    expect(globalContainer.get(Engine).name).toBe('sporty');
    expect(scopedContainer.get(Engine).name).toBe('sporty');

    globalContainer.get(Car).name = 'MyCar';
    globalContainer.get(Engine).name = 'regular';

    expect(globalContainer.get(Car).name).toBe('MyCar');
    expect(scopedContainer.get(Car).name).toBe('MyCar');

    expect(globalContainer.get(Engine).name).toBe('regular');
    expect(scopedContainer.get(Engine).name).toBe('sporty');
  });

  it('should support function injection with Token dependencies', function () {
    const myToken: Token<string> = new Token<string>('myToken');

    Container.set({ id: myToken, value: 'test_string', dependencies: [] });
    Container.set({
      id: 'my-service-A',
      factory: function myServiceFactory(container: ContainerInstance): string {
        return container.get(myToken).toUpperCase();
      },
      dependencies: [],
    });

    /**
     * This is an unusual format and not officially supported, but it should work.
     * We can set null as the target, because we have set the ID manually, so it won't be used.
     */
    Service({
      id: 'my-service-B',
      dependencies: [],
      factory: function myServiceFactory(container: ContainerInstance): string {
        return container.get(myToken).toUpperCase();
      },
    })(() => {});

    expect(Container.get<string>('my-service-A')).toBe('TEST_STRING');
    expect(Container.get<string>('my-service-B')).toBe('TEST_STRING');
  });

  it('should support an object with dependencies with no other arguments', () => {
    @decorator([])
    class AnotherService {
      getMeaningOfLife() {
        return 42;
      }
    }

    @decorator({ dependencies: [AnotherService] })
    class MyService {
      constructor(public anotherService: AnotherService) {}
    }

    expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
  });

  it('should throw if incorrect arguments are passed', () => {
    // @ts-expect-error
    expect(() => Service(null, null)(null)).toThrowError();
    // @ts-expect-error
    expect(() => Service(null, [])(class {})).toThrowError();
    // @ts-expect-error
    expect(() => Service({}, [])(null)).toThrowError();
    // @ts-expect-error
    expect(() => Service({}, null)(class {})).toThrowError();
    // @ts-expect-error
    expect(() => Service([])(null)).toThrowError();
  });

  it('should throw if called twice on the same class', () => {
    expect(() => {
      @decorator([])
      @decorator([])
      class MyService {}
    }).toThrowError();
  });

  describe('multiple: true', () => {
    it('should work with the same ID', () => {
      const id = new Token<MyService>('MyService');

      @decorator({ id, multiple: true }, [])
      class MyService {}

      @decorator({ id, multiple: true }, [])
      class MyService1 {}

      @decorator({ id, multiple: true }, [])
      class MyService2 {}

      expect(() => Container.getMany(id)).not.toThrowError();

      const instances = Container.getMany(id);

      expect(instances).toBeInstanceOf(Array);
      expect(instances[0]).toBeInstanceOf(MyService);
      expect(instances[1]).toBeInstanceOf(MyService1);
      expect(instances[2]).toBeInstanceOf(MyService2);
    });
  });

  describe('Protection against built-in types', () => {
    const builtinTypes = [String, Object, Symbol, Array, Number, Boolean];

    describe.each(builtinTypes.map(type => ({ type, name: type.name })))('$name() usage', ({ type: builtinType }) => {
      it('throws if used and no factory is provided', () => {
        expect(() => {
          @decorator([builtinType])
          class MyService {}
        }).toThrowError();
      });

      it('does not throw if used and a factory is provided', () => {
        @decorator({ factory: () => new MyService() }, [builtinType])
        class MyService {}

        expect(Container.get(MyService)).toBeInstanceOf(MyService);
      });

      it('does not add the ID to the registry if usage was incorrect', () => {
        const id = new Token();

        expect(() => {
          @decorator({ id }, [builtinType])
          class MyService {}
        }).toThrowError();

        expect(Container.has(id)).toStrictEqual(false);
      });
    });
  });
});
