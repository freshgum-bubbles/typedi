import { HostContainer, Token } from 'internal:typedi';
import {
  ServiceIdentifierType,
  getServiceIdentifierType,
} from 'internal:typedi/contrib/util/get-service-identifier-type.util.mjs';
import { createRandomUid } from '../../utils/create-random-name.util';

describe('getServiceIdentifierType', () => {
  it.each([
    HostContainer()
  ])('It correctly reports $name as ServiceIdentifierType.Virtual', id => {
    expect(getServiceIdentifierType(id)).toStrictEqual(ServiceIdentifierType.Virtual);
  });

  it.each([
    { plural: 'tokens', id: new Token<string>() },
    { plural: 'string IDs', id: createRandomUid() },
    { plural: 'class IDs', id: class {} },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    { plural: 'function IDs', id: function () {} },
  ])('It correctly reports $plural as ServiceIdentifierType.Concrete', ({ id }) => {
    expect(getServiceIdentifierType(id)).toStrictEqual(ServiceIdentifierType.Concrete);
  });
});
