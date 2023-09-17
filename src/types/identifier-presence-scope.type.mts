/**
 * A specification of how an identifier is implemented inside a container.
 */
export const enum IdentifierPresenceScope {
    /** The identifier is implemented as a group of values. */
    Many = 0b10,

    /** The identifier is implemented as a singular item.  */
    Singular = 0b01,

    /**
     * The identifier is either implemented as {@link IdentifierPresenceScope.Many | a group of values},
     * or {@link IdentifierPresenceScope.Singular | a singular value}.
     */
    Any = 0b11
}
