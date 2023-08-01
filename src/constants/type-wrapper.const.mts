export const TYPE_WRAPPER = Symbol('type-wrapper');

/**
 * We make use of a const enum to stamp each {@link TypeWrapper} as it
 * allows us to inline the 0 wherever this enum is referenced.
 * This enum has, and will most likely only have, one member.
 *
 * This gives us the best of both worlds: we get to use a magic value,
 * without hard-coding numbers everywhere.
 */
export const enum TypeWrapperStamp {
  Generic,
}
