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
 * Thrown when requested service was not found.
 *
 * @group Errors
 */
export class ServiceNotFoundError extends NativeError {
  public readonly name = 'ServiceNotFoundError';

  /** Normalized identifier name used in the error message. */
  private readonly normalizedIdentifier: string;

  public readonly message: string;

  constructor(identifier: ServiceIdentifier) {
    super();
    this.normalizedIdentifier = normalizeIdentifier(identifier);

    this.message =
      `Service with "${this.normalizedIdentifier}" identifier was not found in the container. ` +
      `Register it before usage via "Container.set" or the "@Service()" decorator.`;
  }
}
