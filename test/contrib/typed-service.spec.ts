import { TypedService } from 'internal:typedi/contrib/typed-service/typed-service.decorator.mjs';

describe('TypedService', () => {
    it('is a function', () => {
        expect(typeof TypedService).toStrictEqual('function');
    });
});
