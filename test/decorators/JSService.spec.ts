import Container from '../../src/index';
import { JSService } from '../../src/decorators/js-service.decorator';
import { AnyConstructable } from '../types/any-constructable.type';

describe('JSService decorator', () => {
    beforeEach(() => Container.reset({ strategy: 'resetValue' }));

    type InstanceOf<T> = T extends AnyConstructable<infer U> ? U : never;

    it('should take dependencies and constructor', () => {
        type AnotherService = InstanceOf<typeof AnotherService>;
        const AnotherService = JSService([], class AnotherService {
            getMeaningOfLife () {
                return 42;
            }
        });

        type MyService = InstanceOf<typeof MyService>;
        const MyService = JSService([AnotherService], class MyService {
            constructor (public anotherService: AnotherService) { }
        });

        expect(Container.has(MyService)).toBe(true);
        expect(Container.has(AnotherService)).toBe(true);
        expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
    });

    it('should take options without dependencies, list of dependencies and constructor', () => {
        type AnotherService = InstanceOf<typeof AnotherService>;
        const AnotherService = JSService([], class AnotherService {
            getMeaningOfLife () {
                return 42;
            }
        });

        type MyService = InstanceOf<typeof MyService>;
        const MyService = JSService({ }, [AnotherService], class MyService {
            public anotherService: AnotherService;

            constructor (anotherService: AnotherService) {
                this.anotherService = anotherService;
            }
        });

        expect(Container.has(MyService)).toBe(true);
        expect(Container.has(AnotherService)).toBe(true);
        expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
    });

    it('should take options with dependencies and constructor', () => {
        type AnotherService = InstanceOf<typeof AnotherService>;
        const AnotherService = JSService([], class AnotherService {
            getMeaningOfLife () {
                return 42;
            }
        });

        type MyService = InstanceOf<typeof MyService>;
        const MyService = JSService({ dependencies: [AnotherService] }, class MyService {
            public anotherService: AnotherService;

            constructor (anotherService: AnotherService) {
                this.anotherService = anotherService;
            }
        });

        expect(Container.has(MyService)).toBe(true);
        expect(Container.has(AnotherService)).toBe(true);
        expect(Container.get(MyService).anotherService.getMeaningOfLife()).toStrictEqual(42);
    });

    it('should provide a functioning JSService type', () => {
        const MyService = JSService([], class MyService {
            getOne () {
                return 1;
            }
        });

        type MyService = JSService<typeof MyService>;
        
        const myService: MyService = Container.get(MyService);
    });
});