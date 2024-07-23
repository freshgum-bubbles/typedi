/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isExecutableToken } from '../../executable-token.class.mjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Token, HostContainer, ServiceIdentifier } from '../../index.mjs';

/**
 * A description of a {@link ServiceIdentifier}'s type.
 *
 * @see {@link getServiceIdentifierType}
 */
export enum ServiceIdentifierType {
  /**
   * A concrete value is one which has been set by the consumer.
   * An example of this would be an ordinary {@link Token}, or a string ID.
   */
  Concrete,

  /**
   * A virtual identifier is provided by the container.
   * An example of this would be {@link HostContainer}.
   */
  Virtual,
}

/**
 * Attain the type of the specified identifier.
 *
 * @see {@link ServiceIdentifierType}.
 *
 * @param identifier The identifier to test.
 * @returns Whether the provided identifier is virtual.
 */
export function getServiceIdentifierType<TIdentifier extends ServiceIdentifier>(identifier: TIdentifier) {
  return isExecutableToken(identifier) ? ServiceIdentifierType.Virtual : ServiceIdentifierType.Concrete;
}
