export function hasOwnProperty(object: any, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
