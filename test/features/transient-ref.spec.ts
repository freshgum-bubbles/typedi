import { Container, Service, ServiceIdentifier, TransientRef } from '../../src/index';
import { TransientRefHost } from '../../src/transient-ref-host.class';
import { TYPE_WRAPPER, TypeWrapperStamp } from '../../src/constants/type-wrapper.const';

describe('Transient References', () => {
  describe('TransientRef', () => {
    it('should be a function', () => {
      expect(typeof TransientRef).toBe('function');
    });

    // Create a temporary service and bind it to the Container just so we can pass it to TransientRef.
    @Service([ ])
    class ServiceInContainerWhichShouldNotBeUsed { }

    class ServiceNotInContainerWithShouldNotBeUsed { }

    it.each([
      { id: Symbol(), name: 'a symbol' },
      { id: 'string', name: 'a string' },
      { id: ServiceInContainerWhichShouldNotBeUsed, name: 'an existent service' },
      { id: ServiceNotInContainerWithShouldNotBeUsed, name: 'a non-existent service' }
    ])('shouldn\'t fail where the input is $name', ({ id }) => {
      expect(() => TransientRef(id as ServiceIdentifier)).not.toThrow();
    });

    it('should return a TypeWrapper with a valid stamp', () => {
      class A { }

      const ref = TransientRef(A);
      expect(ref).toMatchObject({ [TYPE_WRAPPER]: TypeWrapperStamp.Generic });
    })

    it('should be usable as a Service dependency', () => {
      let instanceIndex = 0;

      @Service({ scope: 'transient' }, [])
      class MyTransientService {
        index = ++instanceIndex;
      }

      @Service([
        TransientRef(MyTransientService)
      ])
      class MyService {
        constructor (public receivedValue: unknown) {}
      }

      const myService = Container.get(MyService);
      expect(myService.receivedValue).toBeInstanceOf(TransientRefHost);

      const transientRefHost = myService.receivedValue as TransientRefHost<typeof MyTransientService>;
      
      const instances = [
        transientRefHost.create(),
        transientRefHost.create(),
        transientRefHost.create()
      ];

      const [instance1, instance2, instance3] = instances;

      for (const item of instances) {
        expect(item).toBeInstanceOf(MyTransientService); 
      }

      expect(instance1.index).not.toStrictEqual(instance2.index);
      expect(instance1.index).not.toStrictEqual(instance3.index);
    });

    // TODO: this is an important consideration
    it.skip('should work correctly with resolution constraints', () => {

    });
  });
});
