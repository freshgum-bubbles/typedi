import { EMPTY_VALUE } from './empty.const.mjs';

/**
 * An object containing default values for services.
 * @ignore @internal
 *
 * @remarks
 * This can then be merged in to passed-in services to provide them with
 * default configuration where an option has not been explicitly specified.
 */
export const SERVICE_METADATA_DEFAULTS = {
  multiple: false,
  eager: false,
  scope: 'container',
  value: EMPTY_VALUE,
  factory: undefined,
} as const;
