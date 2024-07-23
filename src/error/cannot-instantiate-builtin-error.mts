/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ServiceIdentifier } from '../index.mjs';
import { CannotInstantiateValueError } from './cannot-instantiate-value.error.mjs';

/**
 * Thrown when DI encounters a service depending on a built-in type (Number, String) with no factory.
 *
 * @group Errors
 */
export class CannotInstantiateBuiltInError extends CannotInstantiateValueError {
  public readonly message =
    super.message + ` If your service requires built-in or unresolvable types, please use a factory.`;

  constructor(identifier: ServiceIdentifier, footer?: string) {
    super(identifier, footer);
  }
}
