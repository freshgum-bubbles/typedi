import { Container, Service } from 'internal:typedi';
import { GH_UPSTREAM, createTestNameFromGitHubIssue } from '../../../utils/create-test-name-from-github-issue.util';

const TEST_NAME = createTestNameFromGitHubIssue({
  id: 61,
  summary: 'A child container creates a new instance of a service each time .get is called',
  repository: GH_UPSTREAM
});

describe(TEST_NAME, function () {
  beforeEach(() => Container.reset({ strategy: 'resetValue' }));

  it('should work properly', function () {
    @Service([])
    class CarABC {
      public name = 'carabc-default';
    }

    const fooContainer = Container.of('foo');
    const barContainer = Container.of('bar');

    // Set the "name" of the CarABC in root.
    Container.get(CarABC).name = 'carabc-root';

    const car1Name = Container.get(CarABC).name;
    const car2Name = Container.get(CarABC).name;

    // Set the "name" of the CarABC for fooContainer.
    fooContainer.get(CarABC).name = 'carabc-foo';

    const fooCar1Name = fooContainer.get(CarABC).name;
    const fooCar2Name = fooContainer.get(CarABC).name;

    // Set the "name" of the CarABC in barContainer.
    barContainer.get(CarABC).name = 'carabc-bar';

    const barCar1Name = barContainer.get(CarABC).name;
    const barCar2Name = barContainer.get(CarABC).name;

    expect(car1Name).toEqual(car2Name);
    expect(fooCar1Name).toEqual(fooCar2Name);
    expect(barCar1Name).toEqual(barCar2Name);
    expect(barCar1Name).toStrictEqual('carabc-bar');

    expect(car1Name).toStrictEqual('carabc-root');
    expect(fooCar1Name).toStrictEqual('carabc-foo');

    // expect(Container.of('TEST').get(CarABC, false)).toStrictEqual(Container.of('TEST').get(CarABC, false).serial);
  });
});
