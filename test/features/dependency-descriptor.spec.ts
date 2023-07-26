import {
  Container,
  Service,
  ContainerInstance,
  ServiceIdentifier,
  Optional,
} from '../../src/index';
import { DependencyDescriptor } from '../../src/interfaces/dependency-descriptor.interface';

describe('DependencyDescriptor', () => {
  it('should be passed to factory functions to describe dependencies', () => {
    /**
     * We elide the explicit declaration of a service here to ensure that,
     * when a factory function is provided, dependencies are not resolved.
     */
    class MyDependency {}

    const myServiceFactoryMock = jest
      .fn<number, [ContainerInstance, ServiceIdentifier, DependencyDescriptor[]], void>()
      .mockReturnValue(2);

    @Service({ factory: myServiceFactoryMock }, [[MyDependency, Optional()]])
    class MyService {}

    expect(Container.get(MyService)).toStrictEqual(2);
    expect(myServiceFactoryMock).toHaveBeenCalledTimes(1);

    // Ensure the signature is correct.
    const [firstCallArgs] = myServiceFactoryMock.mock.calls;

    expect(firstCallArgs[0]).toStrictEqual(Container);
    expect(firstCallArgs[1]).toStrictEqual(MyService);
    expect(firstCallArgs[2]).toMatchObject([{ constraints: Optional(), id: MyDependency }]);
  });

  it('should be passed to method factories to describe dependencies', () => {
    class Car {}

    const createCarFactoryMock = jest
      .fn<Car, [ContainerInstance, ServiceIdentifier, DependencyDescriptor[]], void>()
      .mockImplementation(() => new Car());

    @Service([])
    class Factory {
      createCar = createCarFactoryMock;
    }

    @Service({ factory: [Factory, 'createCar'] }, [[Car, Optional()]])
    class SecretlyCar {}

    Container.get(SecretlyCar);

    expect(Container.get(SecretlyCar)).toBeInstanceOf(Car);
    expect(createCarFactoryMock).toHaveBeenCalledTimes(1);

    // Ensure the signature is correct.
    const [firstCallArgs] = createCarFactoryMock.mock.calls;

    expect(firstCallArgs[0]).toStrictEqual(Container);
    expect(firstCallArgs[1]).toStrictEqual(SecretlyCar);
    expect(firstCallArgs[2]).toMatchObject([{ constraints: Optional(), id: Car }]);
  });
});
