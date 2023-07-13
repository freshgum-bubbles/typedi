/**
 * A list of functions representing built-in types.
 * @ignore @internal
 * 
 * @privateRemarks
 * When these are used as dependencies for a service which does not
 * have a corresponding factory, TypeDI will throw an error.
 * This is because, while these functions *are* valid constructors,
 * in most cases they won't create what the caller expected when
 * instantiated.
 * Furthermore, they won't resolve in the context of the container.
 */
export const BUILT_INS = [String, Object, Boolean, Symbol, Array, Number];
