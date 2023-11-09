import { Token } from 'internal:typedi';
import { VIRTUAL_IDENTIFIERS } from 'internal:typedi/constants/virtual-ids.const.mjs';
import { isVirtualIdentifier } from 'internal:typedi/contrib/util/is-virtual-identifier.util.mjs';
import { createRandomUid } from '../../utils/create-random-name.util';

describe('isVirtualIdentifier', () => {
    it.each(VIRTUAL_IDENTIFIERS)('It correctly reports $name as virtual', (id) => {
        expect(isVirtualIdentifier(id)).toStrictEqual(true);
    });

    it.each([
        { plural: 'tokens', id: new Token<string>() },
        { plural: 'string IDs', id: createRandomUid() },
        { plural: 'class IDs', id: class { } },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { plural: 'function IDs', id: function () { } }
    ])('It correctly reports $plural as concrete', ({ id }) => {
        expect(isVirtualIdentifier(id)).toStrictEqual(false);
    });
});