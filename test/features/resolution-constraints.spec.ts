import { Container, ContainerInstance, Many, Optional, Self, SkipSelf } from '../../src/index';
import { Service } from '../../src/decorators/service.decorator';

describe('Resolution Constraints', function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  describe('Optional', function () {
    it('should work correctly on its own', function () {
      class ThisWillNotResolve {}

      @Service([[ThisWillNotResolve, Optional()]])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      expect(Container.get(MyService).receivedValue).toStrictEqual(null);
    });

    it('should defer back to the actual value if it is present', function () {
        @Service([])
        class ThisWillResolve { }

        @Service([[ThisWillResolve, Optional()]])
        class MyService {
            constructor (public receivedValue: unknown) { }
        }

        expect(Container.get(MyService).receivedValue).toBeInstanceOf(ThisWillResolve);
    });
  });

  describe('SkipSelf', function () {
    it('should skip the value in the current container', function () {
        const childContainer = Container.of(Symbol());

        const mockNeverRunsFn = jest.fn();
        const mockShouldRunFn = jest.fn();

        @Service({ container: childContainer }, [])
        class ThisShouldNeverRun {
            constructor () {
                mockNeverRunsFn();
            }
        }

        /** This will be bound to the default container, which is the parent of childContainer. */
        @Service({ id: ThisShouldNeverRun }, [ ])
        class ThisShouldRun {
            constructor () {
                mockShouldRunFn();
            }
        }

        @Service([
            [ThisShouldNeverRun, SkipSelf()]
        ])
        class MyService {
            constructor (public receivedValue: unknown) { }
        }

        const myService = childContainer.get(MyService);

        expect(myService.receivedValue).toBeInstanceOf(ThisShouldRun);
        expect(mockNeverRunsFn).not.toHaveBeenCalled();
        expect(mockShouldRunFn).toHaveBeenCalledTimes(1);
    });

    it('should immediately fail if the container does not have a parent', function () {
        const containerWithNoParent = ContainerInstance.of(Symbol(), null);

        @Service([])
        class AnotherService { }

        @Service({ container: containerWithNoParent }, [
            [AnotherService, SkipSelf()]
        ])
        class MyService { }

        expect(() => containerWithNoParent.get(MyService)).toThrowError();
    });
  });

  describe('Many', function () {
    it.skip('should return the many instances of the given identifier', function () {
        @Service({ multiple: true }, [ ])
        class Dependency { }

        @Service([[Dependency, Many()]])
        class MyService {
            constructor (public receivedValue: unknown) { }
        }

        expect(() => Container.get(MyService)).not.toThrowError();
        expect(Container.get(MyService).receivedValue).toMatchObject([Dependency]);
    });

    it.skip('should throw an error if the identifier cannot be found', function () {

    });

    it.skip('should return null when combined with Optional and the identifier cannot be found', function () {

    });

    it.skip('should work correctly with Skip', function () {

    });

    it.skip('should work correctly with SkipSelf', function () {

    });
  });

  describe('Self', function () {
    it('should error if ID not found in current container, even if its parent has it', function () {
        /** 90% of this was copied from above, with some small modifications. Why re-write it? :-) */
        const childContainer = Container.ofChild(Symbol());
        const mockNeverRunsFn = jest.fn().mockName("Should Not Run");
        
        @Service([])
        class ThisShouldNeverRun {
            constructor () {
                mockNeverRunsFn();
            }
        }

        @Service({ container: childContainer }, [
            [ThisShouldNeverRun, Self()]
        ])  
        class MyService {
            constructor () { }
        }

        expect(() => childContainer.get(MyService)).toThrowError();
        // expect(mockNeverRunsFn).not.toHaveBeenCalled();
    });

    it('should return null when combined with Optional and the identifier cannot be found', function () {
        const childContainer = Container.ofChild(Symbol());

        @Service([ ])
        class Dependency {
            constructor () {}
        }

        @Service({ container: childContainer }, [[Dependency, Self() | Optional()]])
        class MyService {
            constructor (public receivedValue: unknown) { }
        }

        expect(() => childContainer.get(MyService)).not.toThrowError();
        expect(childContainer.get(MyService).receivedValue).toBeNull();
    });

    it('should find locally-resolvable identifiers', function () {
        const childContainer = Container.ofChild(Symbol());

        @Service({ container: childContainer }, [ ])
        class Dependency {
            constructor () {}
        }

        @Service({ container: childContainer }, [[Dependency, Self()]])
        class MyService {
            constructor (public receivedValue: unknown) { }
        }

        expect(() => childContainer.get(MyService)).not.toThrowError();
        expect(childContainer.get(MyService).receivedValue).toBeInstanceOf(Dependency);
    });
  });
});
