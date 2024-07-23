/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { NativeError } from '../constants/minification/native-error.const.mjs';
import { ServiceIdentifier } from '../types/service-identifier.type.mjs';
import { normalizeIdentifier } from '../utils/normalize-identifier.util.mjs';

/**
 * Thrown when DI cannot inject value into property decorated by `@Inject` decorator.
 *
 * @group Errors
 */
export class CannotInstantiateValueError extends NativeError {
  public readonly name = 'CannotInstantiateValueError';

  /** Normalized identifier name used in the error message. */
  private readonly normalizedIdentifier: string;
  public readonly message: string;

  constructor(
    identifier: ServiceIdentifier,
    private footer = ''
  ) {
    super();
    this.normalizedIdentifier = normalizeIdentifier(identifier);
    this.message =
      `Cannot instantiate the requested value for the "${this.normalizedIdentifier}" identifier. ` +
      `The related metadata doesn't contain a factory or a type to instantiate. ` +
      this.footer;
  }
}
