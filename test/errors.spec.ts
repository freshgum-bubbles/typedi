import {
  CannotInstantiateBuiltInError,
  CannotInstantiateValueError,
  ContainerRegistryError,
  ServiceNotFoundError,
} from 'internal:typedi';

describe.each([
  CannotInstantiateBuiltInError,
  CannotInstantiateValueError,
  ContainerRegistryError,
  ServiceNotFoundError,
])('$name', errorCtor => {
  it('is a function', () => {
    expect(typeof errorCtor).toBe('function');
  });

  it('extends the Error class', () => {
    expect(Object.create(errorCtor.prototype)).toBeInstanceOf(Error);
  });

  it('has native Error class static methods', () => {
    expect(typeof errorCtor.captureStackTrace).toBe('function');
    expect(typeof errorCtor.prepareStackTrace).toBe('function');
  });
});

// TODO: Add tests for identifier normalization here.
// Surprised the coverage doesn't pick that up, as we never actually construct
// the classes in this suite.
