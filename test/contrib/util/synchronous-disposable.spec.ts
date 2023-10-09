import { Disposable } from 'internal:typedi/types/disposable.type.mjs';
import { SynchronousDisposable } from '../../../src/contrib/util/synchronous-disposable.class.mjs';

describe('SynchronousDisposable', () => {
    it('should be a function', () => {
        expect(typeof SynchronousDisposable).toStrictEqual('function');
    });
    
    it('should implement the container-provided\'s Disposable type', () => {
        const temp: Disposable = new SynchronousDisposable();
        // TODO: set up proper jest-tsc testing
        expect(typeof temp).toBe('object');
    });

    it('should have a "disposed" property initially set to false', () => {
        const disposable = new SynchronousDisposable();
        expect(disposable.disposed).toStrictEqual(false);
    });
    
    describe('.dispose()', () => {
        it('should set "disposed" to true', () => {
            const disposable = new SynchronousDisposable();
            expect(() => disposable.dispose()).not.toThrow();
            expect(disposable.disposed).toStrictEqual(true);
        });

        it('should throw if it has already been called', () => {
            const disposable = new SynchronousDisposable();
            expect(() => disposable.dispose()).not.toThrow();
            expect(() => disposable.dispose()).toThrow();
        });
    });
});
