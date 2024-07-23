/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

/**
 * Used to create unique typed service identifier.
 * Useful when service has only interface, but don't have a class.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class Token<T> {
  /**
   * @param name Token name, optional and only used for debugging purposes.
   */
  constructor(public name?: string) {}
}
