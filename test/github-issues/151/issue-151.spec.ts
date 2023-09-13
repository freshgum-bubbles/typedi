import { Container, Service } from 'internal:typedi';

describe('Github Issues', function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('#151 - should be able to define type when setting service', () => {
    /**
     * Note: This is more like a behavioral test the use-case showcased below
     * should be always possible, even if the API changes.
     */
    @Service([])
    class AuthService {
      isAuthorized() {
        return 'nope';
      }
    }

    @Service([AuthService])
    class DataService {
      constructor(public authService: AuthService) {}
    }

    @Service([AuthService])
    class FakeDataService {
      constructor(public authService: AuthService) {}
    }

    Container.set({ id: DataService, type: FakeDataService, dependencies: [AuthService] });

    const instance = Container.get<FakeDataService>(DataService as any);

    expect(instance).toBeInstanceOf(FakeDataService);
    expect(instance.authService).toBeInstanceOf(AuthService);
    expect(instance.authService.isAuthorized()).toBe('nope');
  });
});
