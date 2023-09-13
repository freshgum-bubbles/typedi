import {
  Container,
  Many,
  Self,
  Service,
  ServiceIdentifier,
  ServiceNotFoundError,
  SkipSelf,
  Token,
} from 'internal:typedi';
import { TransientRef } from '../../src/contrib/transient-ref/transient-ref.function.mjs';
import { TransientRefHost } from '../../src/contrib/transient-ref/transient-ref-host.class.mjs';
import { TYPE_WRAPPER, TypeWrapperStamp } from '../../src/constants/type-wrapper.const.mjs';

describe('Transient References', () => {
  describe('TransientRef', () => {
    it('should be a function', () => {
      expect(typeof TransientRef).toBe('function');
    });

    // Create a temporary service and bind it to the Container just so we can pass it to TransientRef.
    @Service([])
    class ServiceInContainerWhichShouldNotBeUsed {}

    class ServiceNotInContainerWithShouldNotBeUsed {}

    it.each([
      { id: Symbol(), name: 'a symbol' },
      { id: 'string', name: 'a string' },
      { id: ServiceInContainerWhichShouldNotBeUsed, name: 'an existent service' },
      { id: ServiceNotInContainerWithShouldNotBeUsed, name: 'a non-existent service' },
    ])("shouldn't fail where the input is $name", ({ id }) => {
      expect(() => TransientRef(id as ServiceIdentifier)).not.toThrow();
    });

    it('should return a TypeWrapper with a valid stamp', () => {
      class A {}

      const ref = TransientRef(A);
      expect(ref).toMatchObject({ [TYPE_WRAPPER]: TypeWrapperStamp.Generic });
    });

    it('should be usable as a Service dependency', () => {
      let instanceIndex = 0;

      @Service({ scope: 'transient' }, [])
      class MyTransientService {
        index = ++instanceIndex;
      }

      @Service([TransientRef(MyTransientService)])
      class MyService {
        constructor(public receivedValue: unknown) {}
      }

      const myService = Container.get(MyService);
      expect(myService.receivedValue).toBeInstanceOf(TransientRefHost);

      const transientRefHost = myService.receivedValue as TransientRefHost<typeof MyTransientService>;

      const instances = [transientRefHost.create(), transientRefHost.create(), transientRefHost.create()];

      const [instance1, instance2, instance3] = instances;

      for (const item of instances) {
        expect(item).toBeInstanceOf(MyTransientService);
      }

      expect(instance1.index).not.toStrictEqual(instance2.index);
      expect(instance1.index).not.toStrictEqual(instance3.index);
    });

    // TODO: this is an important consideration
    it.skip('should work correctly with resolution constraints', () => {});

    describe('Non-transient identifier handling', () => {
      // #region Name Scenario
      const SCENARIO_NAME = new Token<string>();

      function setNameValue() {
        Container.set({ id: SCENARIO_NAME, value: 'Joanna' });
      }

      function runScenario() {
        @Service([TransientRef(SCENARIO_NAME)])
        class MyService {}

        return MyService;
      }
      // #endregion

      it('should not initially throw if given a non-transient identifier', () => {
        setNameValue();
        expect(runScenario).not.toThrowError();
      });

      it('should throw if given a non-transient identifier and the class is initialized', () => {
        setNameValue();
        expect(() => {
          Container.get(runScenario());
        }).toThrowError(Error);
      });
    });

    describe('Resolution Constraint Handling', () => {
      it('should respect SkipSelf', () => {
        const NAME = new Token<string>();
        const childContainer = Container.ofChild(Symbol());

        @Service({ container: childContainer }, [[TransientRef(NAME), SkipSelf()]])
        class MyService {
          constructor(public receivedValue: TransientRefHost<string>) {}
        }

        childContainer.set({ id: NAME, value: 'Joanna', scope: 'transient' });
        Container.set({ id: NAME, value: 'Roxy', scope: 'transient' });

        expect(() => childContainer.get(MyService)).not.toThrowError();
        expect(childContainer.get(MyService).receivedValue.create()).toStrictEqual('Roxy');
      });

      it('should respect Self', () => {
        const NAME = new Token<string>();
        const childContainer = Container.ofChild(Symbol());

        @Service({ container: childContainer }, [[TransientRef(NAME), Self()]])
        class MyService {
          constructor(public receivedValue: TransientRefHost<string>) {}
        }

        Container.set({ id: NAME, value: 'Roxy', scope: 'transient' });
        expect(() => childContainer.get(MyService)).toThrowError(ServiceNotFoundError);
      });

      it('should respect Many', () => {
        const childContainer = Container.ofChild(Symbol());
        const NAME = new Token<string>();

        @Service({ container: childContainer }, [[TransientRef(NAME), Many()]])
        class MyService {
          constructor(public receivedValue: TransientRefHost<string>) {}
        }

        /** Names deliberately placed *after* declaration to ensure presence isn't checked at function call. */
        const names = ['Roxy', 'Ricky', 'Donald'];
        names.forEach(name => Container.set({ id: NAME, value: name, scope: 'transient', multiple: true }));

        expect(() => childContainer.get(MyService)).not.toThrowError();
        expect(childContainer.get(MyService).receivedValue.create()).toMatchObject(names);
      });

      // it('should remove Optional() for .create', () => {

      // });
    });
  });
});
