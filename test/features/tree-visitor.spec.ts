import {
  Container,
  ContainerInstance,
  ServiceIdentifier,
  ServiceMetadata,
  Token,
  ContainerTreeVisitor,
  VisitRetrievalOptions,
  ServiceIdentifierLocation,
} from 'internal:typedi';

describe('Tree Visitors', () => {
  interface VisitorMock extends ContainerTreeVisitor {
    disposed: boolean;
    dispose: jest.Mock<void, [], VisitorMock>;
    visitChildContainer: jest.Mock<void, [ContainerInstance], VisitorMock>;
    visitOrphanedContainer: jest.Mock<void, [ContainerInstance], VisitorMock>;
    visitNewService: jest.Mock<void, [ServiceMetadata<unknown>], VisitorMock>;
    visitContainer: jest.Mock<boolean, [ContainerInstance], VisitorMock>;
    visitRetrieval: jest.Mock<void, [ServiceIdentifier<unknown>, VisitRetrievalOptions], VisitorMock>;
  }

  /**
   * Create a mock implementation of {@link ContainerTreeVisitor}.
   *
   * _Note: this does not call {@link ContainerInstance.acceptTreeVisitor}._
   */
  function createVisitorMock(): VisitorMock {
    const visitor: VisitorMock = {
      disposed: false,
      dispose: jest.fn().mockImplementation(() => (visitor.disposed = true)),
      visitChildContainer: jest.fn(),
      visitOrphanedContainer: jest.fn(),
      visitNewService: jest.fn(),
      visitContainer: jest.fn().mockReturnValue(true),
      visitRetrieval: jest.fn(),
    };

    return visitor;
  }

  function createAndSetupVisitorMock(container: ContainerInstance): VisitorMock {
    const mock = createVisitorMock();
    container.acceptTreeVisitor(mock);
    return mock;
  }

  describe('Container.acceptTreeVisitor', () => {
    it('is a function', () => {
      expect(Container.acceptTreeVisitor).toBeInstanceOf(Function);
    });
  });

  describe('Container.detachTreeVisitor', () => {
    it('is a function', () => {
      expect(Container.detachTreeVisitor).toBeInstanceOf(Function);
    });
  });

  describe.each([
    { name: 'Default Container', container: Container },
    { name: 'Orphaned Container', container: ContainerInstance.of(Symbol(), null) },
    { name: 'Child Container', container: Container.ofChild(Symbol()) },
    /** Map each container to test each with a string and a Token. */
  ])('$name: Tree Visitor API', ({ container }) => {
    /** Clear the default container's visitors before each test. */
    beforeEach(() => (Container['visitor']['visitors'] = []));

    describe('visitChildContainer()', () => {
      it('should be called with a reference to every child container', () => {
        const visitor = createAndSetupVisitorMock(container);
        let newChild1 = container.ofChild(Symbol());
        let newChild2 = container.ofChild(Symbol());

        expect(visitor.dispose).not.toHaveBeenCalled();
        expect(visitor.visitChildContainer).toHaveBeenCalledTimes(2);
        expect(visitor.visitChildContainer).toHaveBeenNthCalledWith(1, newChild1);
        expect(visitor.visitChildContainer).toHaveBeenNthCalledWith(2, newChild2);
      });

      it("shan't be called for orphaned containers", () => {
        const visitor = createAndSetupVisitorMock(container);
        let newOrphan = ContainerInstance.of(Symbol(), null);

        expect(visitor.visitChildContainer).not.toHaveBeenCalledWith(newOrphan);
        expect(visitor.visitContainer).not.toHaveBeenCalledWith(newOrphan);
        expect(visitor.visitOrphanedContainer).toHaveBeenCalledTimes(1);
        expect(visitor.visitOrphanedContainer).toHaveBeenCalledWith(newOrphan);
      });

      it("shan't be called for children of children", () => {
        const visitor = createAndSetupVisitorMock(container);
        let newChild = container.ofChild(Symbol());
        let newChildOfChild = newChild.ofChild(Symbol());

        expect(visitor.visitChildContainer).toHaveBeenCalledTimes(1);
        expect(visitor.visitChildContainer).toHaveBeenCalledWith(newChild);
        expect(visitor.visitChildContainer).not.toHaveBeenCalledWith(newChildOfChild);
      });
    });

    describe('visitOrphanedContainer()', () => {
      it('should be called for every orphaned container', () => {
        const visitor = createAndSetupVisitorMock(container);
        let newOrphan = ContainerInstance.of(Symbol(), null);

        expect(visitor.visitOrphanedContainer).toHaveBeenCalledTimes(1);
        expect(visitor.visitOrphanedContainer).toHaveBeenCalledWith(newOrphan);
      });

      it("shan't be called for child containers", () => {
        const visitor = createAndSetupVisitorMock(container);
        let newChild = container.ofChild(Symbol());

        expect(visitor.visitOrphanedContainer).not.toHaveBeenCalled();
      });

      it('will not be passed the default container', () => {
        const visitor = createAndSetupVisitorMock(container);

        expect(visitor.visitOrphanedContainer).toHaveBeenCalledTimes(0);
        expect(visitor.visitOrphanedContainer).not.toHaveBeenCalledWith(ContainerInstance.defaultContainer);
      });
    });

    describe('visitNewService()', () => {
      it('should be called for every new service', () => {
        const visitor = createAndSetupVisitorMock(container);

        const serviceImpl = {
          id: 'test-value',
          value: 1,
          dependencies: [],
        };

        container.set(serviceImpl);

        expect(visitor.visitNewService).toHaveBeenCalledTimes(1);

        /**
         * Ensure the arguments are correct.
         * We need to manually retrieve the arguments here so we can
         * use Jest's matching feature.
         */
        const [firstCallArguments] = visitor.visitNewService.mock.calls;
        expect(firstCallArguments).toMatchObject([serviceImpl]);
      });

      it('should be called for setValue', () => {
        const visitor = createAndSetupVisitorMock(container);
        const token = new Token<symbol>();
        const key = 'TEST_ABC';
        const testValue = Symbol();

        container.setValue(key, testValue);
        container.setValue(token, testValue);

        expect(visitor.visitNewService).toHaveBeenCalledTimes(2);

        const [firstCallArguments, secondCallArguments] = visitor.visitNewService.mock.calls;
        expect(firstCallArguments).toMatchObject([{ id: key, value: testValue, dependencies: [] }]);
        expect(secondCallArguments).toMatchObject([{ id: token, value: testValue, dependencies: [] }]);
      });

      it('should only be called on the connected container', () => {
        const visitor = createAndSetupVisitorMock(container);
        const token = new Token<string>();
        const tokenChild = new Token<string>();
        const testValue = 'TEST_ABC';

        container.setValue(token, testValue);
        const childContainer = container.ofChild(Symbol());
        childContainer.setValue(tokenChild, testValue);

        expect(visitor.visitNewService).toHaveBeenCalledTimes(1);

        const [firstCallArguments] = visitor.visitNewService.mock.calls;
        expect(firstCallArguments).toMatchObject([{ id: token, value: testValue, dependencies: [] }]);
      });
    });

    describe('visitContainer()', () => {
      it('should be called when the visitor is attached', () => {
        const visitor = createAndSetupVisitorMock(container);
        expect(visitor.visitContainer).toHaveBeenCalledTimes(1);
      });

      it('should be called with the container the visitor was attached to', () => {
        const visitor = createAndSetupVisitorMock(container);
        expect(visitor.visitContainer).toHaveBeenCalledWith(container);
      });

      it('should be able to unsubscribe from the container by returning false', () => {
        /**
         *  We use {@link createVisitorMock} here so we can tell
         * {@link ContainerTreeVisitor.visitContainer} to return false.
         */
        const visitor = createVisitorMock();

        visitor.visitContainer.mockReturnValue(false);

        /**
         * If the visitor was attached, the following methods
         * would be called for these operations:
         *   1. {@link ContainerTreeVisitor.visitNewService}
         *   2. {@link ContainerTreeVisitor.visitChildContainer}
         *   3. {@link ContainerTreeVisitor.visitRetrieval}
         *   4. {@link ContainerTreeVisitor.visitOrphanedContainer}
         */
        container.setValue('test', 'value');
        container.ofChild(Symbol());
        container.get('test');
        ContainerInstance.of(Symbol(), null);

        expect(visitor.visitNewService).toHaveBeenCalledTimes(0);
        expect(visitor.visitChildContainer).toHaveBeenCalledTimes(0);
        expect(visitor.visitRetrieval).toHaveBeenCalledTimes(0);
        expect(visitor.visitOrphanedContainer).toHaveBeenCalledTimes(0);
      });

      it('should remove visitors which throw in visitContainer', () => {
        const visitor = createVisitorMock();
        visitor.visitContainer.mockImplementation(() => { throw new Error(); });

        /** Attach the visitor to a container. */
        expect(() => Container.acceptTreeVisitor(visitor)).toThrow(Error);
        
        const testKey = new Token<string>();
        Container.setValue(testKey, 'my value');

        expect(visitor.visitNewService).toHaveBeenCalledTimes(0);
        expect(Container.detachTreeVisitor(visitor)).toBe(false);
      });

      /**
       * We skip the inverse case: visitors that return true are given events.
       * This is because we already implicitly test this (numerous times) above.
       */
    });

    describe('visitRetrieval()', () => {
      it('should be called when a service is requested', () => {
        const visitor = createAndSetupVisitorMock(container);
        const token = new Token<string>();
        const value = 'TEST_ABC';

        container.setValue(token, value);

        /** We haven't requested any values yet, so it shouldn't have been called. */
        expect(visitor.visitRetrieval).toHaveBeenCalledTimes(0);

        container.get(token);
        expect(visitor.visitRetrieval).toHaveBeenCalledTimes(1);
        const [firstCallArguments] = visitor.visitRetrieval.mock.calls;

        expect(firstCallArguments?.[0]).toMatchObject(token);
      });

      it('should be called even for unavailable services', () => {
        const visitor = createAndSetupVisitorMock(container);
        const unavailableToken = new Token<never>();

        /** The operation throws, so we wrap it here. */
        expect(() => container.get(unavailableToken)).toThrowError();
        expect(visitor.visitRetrieval).toHaveBeenCalledTimes(1);

        /** Now the same with {@link ContainerInstance.getOrNull}. */
        container.getOrNull(unavailableToken);
        expect(visitor.visitRetrieval).toHaveBeenCalledTimes(2);

        const [firstCallArguments, secondCallArguments] = visitor.visitRetrieval.mock.calls;
        expect(firstCallArguments?.[0]).toMatchObject(unavailableToken);
        expect(secondCallArguments?.[0]).toMatchObject(unavailableToken);
      });

      describe('many: boolean', () => {
        it('should be true if the service was requested via getMany[OrNull]', () => {
          const visitor = createAndSetupVisitorMock(container);
          const unavailableToken = new Token<never>();
          const availableToken = new Token<string>();
          const testValue = 'TEST_ABC';

          container.set({ id: availableToken, value: testValue, multiple: true, dependencies: [] });

          /** The operation throws, so we wrap it here. */
          expect(() => container.getMany(unavailableToken)).toThrowError();
          expect(visitor.visitRetrieval).toHaveBeenCalledTimes(1);

          /** Now the same with {@link ContainerInstance.getManyOrNull}, but with a valid identifier. */
          container.getManyOrNull(availableToken);
          expect(visitor.visitRetrieval).toHaveBeenCalledTimes(2);

          const [firstCallArguments, secondCallArguments] = visitor.visitRetrieval.mock.calls;
          const expectedRetrievalOptions: Partial<VisitRetrievalOptions> = {
            /** This is the default, so test that here. */
            recursive: true,
            many: true,
          };

          expect(firstCallArguments).toMatchObject([unavailableToken, expectedRetrievalOptions]);
          expect(secondCallArguments).toMatchObject([availableToken, expectedRetrievalOptions]);
        });

        it('should be false if the service was requested via get[OrNull]', () => {
          const visitor = createAndSetupVisitorMock(container);
          const unavailableToken = new Token<never>();
          const availableToken = new Token<string>();
          const testValue = 'TEST_ABC';

          container.setValue(availableToken, testValue);

          /** The operation throws, so we wrap it here. */
          expect(() => container.get(unavailableToken)).toThrowError();
          expect(visitor.visitRetrieval).toHaveBeenCalledTimes(1);

          const [firstCallArguments] = visitor.visitRetrieval.mock.calls;
          const expectedRetrievalOptions: Partial<VisitRetrievalOptions> = {
            /** This is the default, so test that here. */
            recursive: true,
            many: false,
          };

          expect(firstCallArguments).toMatchObject([unavailableToken, expectedRetrievalOptions]);
        });
      });

      describe('location: ServiceIdentifierLocation', () => {
        it('should be None if the service was not found', () => {
          const visitor = createAndSetupVisitorMock(container);
          const unavailableToken = new Token<string>();

          expect(() => container.getMany(unavailableToken, true)).toThrowError();
          container.getManyOrNull(unavailableToken, false);

          expect(() => container.get(unavailableToken, true)).toThrowError();
          container.getOrNull(unavailableToken, false);

          expect(visitor.visitRetrieval).toHaveBeenCalledTimes(4);

          const [firstCallArguments, secondCallArguments, thirdCallArguments, fourthCallArguments] =
            visitor.visitRetrieval.mock.calls;

          expect(firstCallArguments).toMatchObject([
            unavailableToken,
            {
              recursive: true,
              many: true,
              location: ServiceIdentifierLocation.None,
            },
          ]);

          expect(secondCallArguments).toMatchObject([
            unavailableToken,
            {
              recursive: false,
              many: true,
              location: ServiceIdentifierLocation.None,
            },
          ]);

          expect(thirdCallArguments).toMatchObject([
            unavailableToken,
            {
              recursive: true,
              many: false,
              location: ServiceIdentifierLocation.None,
            },
          ]);

          expect(fourthCallArguments).toMatchObject([
            unavailableToken,
            {
              recursive: false,
              many: false,
              location: ServiceIdentifierLocation.None,
            },
          ]);
        });

        it('should be Local if the service was found locally', () => {
          const visitor = createAndSetupVisitorMock(container);
          const testToken = new Token<string>();
          const testValue = 'TEST_ABC';

          container.setValue(testToken, testValue);

          container.get(testToken);
          container.getOrNull(testToken);
          expect(visitor.visitRetrieval).toHaveBeenCalledTimes(2);

          const [firstCallArguments, secondCallArguments] = visitor.visitRetrieval.mock.calls;

          expect(firstCallArguments).toMatchObject([
            testToken,
            {
              many: false,
              recursive: true,
              location: ServiceIdentifierLocation.Local,
            },
          ]);

          expect(secondCallArguments).toMatchObject([
            testToken,
            {
              many: false,
              recursive: true,
              location: ServiceIdentifierLocation.Local,
            },
          ]);
        });

        it('should be Parent if the service was found upstream', () => {
          const childContainer = container.ofChild(Symbol());
          const visitor = createAndSetupVisitorMock(childContainer);
          const testToken = new Token<string>();
          const testValue = 'TEST_ABC';

          /** Set the value on the parent container. */
          container.setValue(testToken, testValue);

          childContainer.get(testToken, true);
          expect(visitor.visitRetrieval).toHaveBeenCalledTimes(1);

          const [firstCallArguments] = visitor.visitRetrieval.mock.calls;

          /**
           * Implementation Note
           * ===================
           *
           * After this call, the token would now be considered as as a local identifier.
           * Therefore, any subsequent calls for the same identifier would return
           * {@link ServiceIdentifierLocation.Local}. This is intended behaviour.
           */
          expect(firstCallArguments).toMatchObject([
            testToken,
            {
              many: false,
              recursive: true,
              location: ServiceIdentifierLocation.Parent,
            },
          ]);
        });
      });
    });
  });
});
