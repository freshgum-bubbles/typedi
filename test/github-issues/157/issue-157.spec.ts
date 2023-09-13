import { Container, Service } from 'internal:typedi';

describe('Github Issues', function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('#157 - reset should not break transient services', () => {
    let creationCounter = 0;

    @Service({ scope: 'transient' }, [])
    class TransientService {
      public constructor() {
        creationCounter++;
      }
    }

    Container.get(TransientService);
    Container.get(TransientService);

    expect(creationCounter).toBe(2);

    Container.reset({ strategy: 'resetValue' });

    Container.get(TransientService);
    Container.get(TransientService);

    expect(creationCounter).toBe(4);
  });
});
