/**
 * Format the name of a class, using either its name or a stringified
 * representation of its object, passed to the String function.
 * @private
 */
export function formatClassName(ctor: any) {
  return String(ctor['name'] || ctor);
}
