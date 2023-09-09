import { TypedService } from '../../../src/contrib/typed-service.decorator';

describe('TypedService', () => {
    it('is a function', () => {
        expect(typeof TypedService).toStrictEqual('function');
    });
});
