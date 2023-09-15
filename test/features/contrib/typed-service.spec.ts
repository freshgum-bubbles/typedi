import { TypedService } from '../../contrib/typed-service/typed-service.decorator';

describe('TypedService', () => {
    it('is a function', () => {
        expect(typeof TypedService).toStrictEqual('function');
    });
});
