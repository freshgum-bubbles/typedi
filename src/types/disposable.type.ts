/**
 * An object containing both a {@link Disposable.disposed | disposed} property,
 * alongside a {@link Disposable.dispose | dispose()} method, which allows for
 * disposal of the object.
 */
export interface Disposable {
  /** Whether the object has already been disposed. */
  disposed: boolean;

  /**
   * Dispose the object.
   * 
   * @returns Either void, or a promise which settles upon
   * completion of the disposal process.
   * 
   * @throws Error
   * This exception may be thrown in the case of an error
   * encountered during the process of disposing the object.
   * The type of error thrown is unknown.
   * 
   * @privateRemarks
   * As this is a semi-internal type which we cast objects to,
   * we have no control over the return type. Thus, the return
   * type of the dispose call could either be a promise or void.
   * In the case of a promise, it is generally expected that the
   * caller would await the process to settle before continuing
   * other operations or returning control to the host context.
   */
  dispose(): Promise<void> | void;
}
