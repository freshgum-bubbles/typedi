import Container, { Optional } from '../../src/index';
import { JSService } from '../../src/decorators/js-service.decorator';
import { AnyConstructable } from '../../src/types/any-constructable.type';

describe('JSService decorator', () => {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  type InstanceOf<T> = T extends AnyConstructable<infer U> ? U : never;

  it('should take dependencies and constructor', () => {
    type AnotherService = InstanceOf<typeof AnotherService>;
    const AnotherService = JSService(
      [],
      class AnotherService {
        getMeaningOfLife() {
          return 42;
        }
      }
    );

    type MyService = InstanceOf<typeof MyService>;
    const MyService = JSService(
      [AnotherService],
      class MyService {
        constructor(public anotherService: AnotherService) {}
      }
    );

    expect(Container.has(MyService)).toBe(true);
    expect(Container.has(AnotherService)).toBe(true);
    expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
  });

  it('should take options without dependencies, list of dependencies and constructor', () => {
    type AnotherService = InstanceOf<typeof AnotherService>;
    const AnotherService = JSService(
      [],
      class AnotherService {
        getMeaningOfLife() {
          return 42;
        }
      }
    );

    type MyService = InstanceOf<typeof MyService>;
    const MyService = JSService(
      {},
      [AnotherService],
      class MyService {
        public anotherService: AnotherService;

        constructor(anotherService: AnotherService) {
          this.anotherService = anotherService;
        }
      }
    );

    expect(Container.has(MyService)).toBe(true);
    expect(Container.has(AnotherService)).toBe(true);
    expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
  });

  it('should take options with dependencies and constructor', () => {
    type AnotherService = InstanceOf<typeof AnotherService>;
    const AnotherService = JSService(
      [],
      class AnotherService {
        getMeaningOfLife() {
          return 42;
        }
      }
    );

    type MyService = InstanceOf<typeof MyService>;
    const MyService = JSService(
      { dependencies: [AnotherService] },
      class MyService {
        public anotherService: AnotherService;

        constructor(anotherService: AnotherService) {
          this.anotherService = anotherService;
        }
      }
    );

    expect(Container.has(MyService)).toBe(true);
    expect(Container.has(AnotherService)).toBe(true);
    expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
  });

  it('should provide a functioning JSService type', () => {
    const MyService = JSService(
      [],
      class MyService {
        getOne() {
          return 1;
        }
      }
    );

    type MyService = JSService<typeof MyService>;

    const myService: MyService = Container.get(MyService);
  });

  it('should accept resolution constraints', () => {
    class ThisShouldNeverWork {}

    const MyService = JSService(
      [[ThisShouldNeverWork, Optional()]],
      class MyService {
        constructor(public receivedValue: unknown) {}
      }
    );
    type MyService = JSService<typeof MyService>;

    expect(() => Container.get(MyService)).not.toThrowError();
    expect(Container.get(MyService).receivedValue).toStrictEqual(null);
  });

  it('should throw an error if the overload is incorrect', () => {
    /** Note: the `as any` casts are required because this invalidates the JSService type contract, and is thus a compilation error. */
    expect(() => JSService(undefined as any, undefined as any)).toThrow();
  });
});
