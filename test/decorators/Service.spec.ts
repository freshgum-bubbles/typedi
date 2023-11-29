/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, ContainerInstance, Service, Token } from 'internal:typedi';
import { WrappedESServiceDecorator } from '../contrib/es/test-utils/es-service-decorator-wrapper.util';

// To ensure conformance between different Service implementations,
// we wrap some decorators here with stubs which pass them quasi-values.
// It goes without saying that, for this to work, we have to ensure that
// each decorator has the same signature as the OG @Service.
// In the case of the ES Decorator suite, we have to pass fake class decorator
// descriptors to them -- this won't affect the validity of the testing,
// as these functions would receive the same objects when used as actual
// ES Decorators at runtime.
// See <test/contrib/es/es-service-decorator-wrapper.util.mjs> for an example.
interface DecoratorTestScenario {
  decorator: typeof Service;
  description: string;
  name: string;
}

const DECORATORS_TO_TEST: DecoratorTestScenario[] = [
  { decorator: Service, description: 'main, non-ES', name: 'Service' },
  { decorator: WrappedESServiceDecorator, description: 'contrib/es/ESService', name: 'ESService' },
];

describe.each(DECORATORS_TO_TEST)('$name decorator ($description)', ({ decorator: Decorator }) => {
  beforeEach(() => Container.reset({ strategy: 'resetServices' }));

  it('should register class in the container, and its instance should be retrievable', function () {
    @Decorator([])
    class TestService {}
    @Decorator({ id: 'super.service' }, [])
    class NamedService {}
    expect(Container.get(TestService)).toBeInstanceOf(TestService);
    expect(Container.get(TestService)).not.toBeInstanceOf(NamedService);
  });

  it('should register class in the container with given name, and its instance should be retrievable', function () {
    @Decorator([])
    class TestService {}
    @Decorator({ id: 'super.service' }, [])
    class NamedService {}
    expect(Container.get('super.service')).toBeInstanceOf(NamedService);
    expect(Container.get('super.service')).not.toBeInstanceOf(TestService);
  });

  it('should register class in the container, and its parameter dependencies should be properly initialized', function () {
    @Decorator([])
    class TestService {}
    @Decorator([])
    class SecondTestService {}
    @Decorator([TestService, SecondTestService])
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
    @Decorator([])
    class Engine {
      constructor(public serialNumber: string) {}
    }

    function createCar() {
      return new Car('BMW', new Engine('A-123'));
    }

    @Decorator({ factory: createCar }, [String, Engine])
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
    @Decorator([])
    class Engine {
      public serialNumber = 'A-123';
    }

    @Decorator([Engine])
    class CarFactory {
      constructor(public engine: Engine) {}

      createCar() {
        return new Car('BMW', this.engine);
      }
    }

    @Decorator({ factory: [CarFactory, 'createCar'] }, [String, Engine])
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
    @Decorator([])
    class Engine {
      public type = 'V8';
    }

    @Decorator([Engine])
    class CarFactory {
      createCar(engine: Engine) {
        engine.type = 'V6';
        return new Car(engine);
      }
    }

    @Decorator({ factory: [CarFactory, 'createCar'] }, [Engine])
    class Car {
      constructor(public engine: Engine) {}
    }

    expect(Container.get(Car).engine.type).toBe('V6');
  });

  it('should support transient services', function () {
    @Decorator([])
    class Car {
      public serial = Math.random();
    }

    @Decorator({ scope: 'transient' }, [])
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
    @Decorator([])
    class Engine {
      public name = 'sporty';
    }

    @Decorator({ scope: 'singleton' }, [])
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
    Decorator({
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
    @Decorator([])
    class AnotherService {
      getMeaningOfLife() {
        return 42;
      }
    }

    @Decorator({ dependencies: [AnotherService] })
    class MyService {
      constructor(public anotherService: AnotherService) {}
    }

    expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
  });

  it('should throw if incorrect arguments are passed', () => {
    // @ts-expect-error
    expect(() => Decorator(null, null)(null)).toThrowError();
    // @ts-expect-error
    expect(() => Decorator(null, [])(class {})).toThrowError();
    // @ts-expect-error
    expect(() => Decorator({}, [])(null)).toThrowError();
    // @ts-expect-error
    expect(() => Decorator({}, null)(class {})).toThrowError();
    // @ts-expect-error
    expect(() => Decorator([])(null)).toThrowError();
  });

  it('should throw if called twice on the same class', () => {
    expect(() => {
      @Decorator([])
      @Decorator([])
      class MyService {}
    }).toThrowError();
  });

  describe('multiple: true', () => {
    it('should work with the same ID', () => {
      const id = new Token<MyService>('MyService');

      @Decorator({ id, multiple: true }, [])
      class MyService {}

      @Decorator({ id, multiple: true }, [])
      class MyService1 {}

      @Decorator({ id, multiple: true }, [])
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
          @Decorator([builtinType])
          class MyService {}
        }).toThrowError();
      });

      it('does not throw if used and a factory is provided', () => {
        @Decorator({ factory: () => new MyService() }, [builtinType])
        class MyService {}

        expect(Container.get(MyService)).toBeInstanceOf(MyService);
      });

      it('does not add the ID to the registry if usage was incorrect', () => {
        const id = new Token();

        expect(() => {
          @Decorator({ id }, [builtinType])
          class MyService {}
        }).toThrowError();

        expect(Container.has(id)).toStrictEqual(false);
      });
    });
  });
});
