/**
 * @fileoverview
 * This file contains a number of strings used in error messages.
 * Some of them are unfinished sentences, which are then interpolated to create
 * error messages.
 *
 * The primary purpose of storing strings here is to reduce the final
 * size of the bundle.  For instance, consider the following (minified) code:
 *
 * ```ts
 * throw Error(`A container with the specified name ("${String(t)}") already exists.`);
 * throw Error(`A container with the specified name ("${String(t)}) does not already exist.`);
 * ```
 *
 * As can clearly be seen, the string "A container with the specified name" is used twice here,
 * for two different scenarios.  As of now, Terser seemingly doesn't create a variable to store
 * the duplicate string, so we do it manually here.
 *
 * The process of replacing duplicate strings with variables should be done cautiously.
 *
 * Instead of performing it to every error message, the generated Terser output should be
 * checked and tested to see if moving the string here has any noticeable impact on the output.
 */
null;

export const __A_CONTAINER_WITH_THE_SPECIFIED_NAME = 'A container with the specified name';
export const __NO_CONTAINER_IS_REGISTERED_WITH_THE_GIVEN_ID = 'No container is registered with the given ID.';
export const __CANNOT_USE_CONTAINER_AFTER_IT_HAS_BEEN_DISPOSED = 'Cannot use container after it has been disposed.';
