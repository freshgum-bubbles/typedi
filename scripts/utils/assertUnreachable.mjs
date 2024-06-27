import assert from 'assert';

/**
 * Throw an error.
 *
 * @param {string | Error | undefined} message - The message or Error instance to throw.
 * @returns {never}
 */
export function assertUnreachable(message) {
  // TODO: This is an awful default.
  assert(false, message ?? 'An unreachable code-point was reached.');
}
