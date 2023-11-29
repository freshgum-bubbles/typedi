import { Container } from "internal:typedi";
import { createFakeClassDecoratorContext } from "./utils/fake-context.util";
import { ESService } from "internal:typedi/contrib/es/es-service.decorator.mjs";

// Due to the testing structure, we can't actually use ES Decorators
// here.  Instead, we have to pretend we're using them, by manually
// passing descriptors and functions to them.
// P.S. The actual conformance testing goes on in <test/decorators/Service.spec.ts>
// This suite just tests parts of required ESService-specific testing.
describe('ESService', () => {
    beforeEach(() => Container.reset({ strategy: 'resetValue' }));

    // Note: in <test/contrib/es/utils/es-service-decorator-wrapper.util.ts>, we already test
    // if the implementation accepts valid invocations with valid ClassDecoratorContext objects.
    it('should fail if not passed a ClassDecoratorContext', () => {
        class MyService { }

        const context = createFakeClassDecoratorContext(MyService);
        expect(() => ESService([ ])(class { }, context)).not.toThrow();
    });
});
