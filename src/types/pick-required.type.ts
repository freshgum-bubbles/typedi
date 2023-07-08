/**
 * From TTarget, make keys in TKeys required.
 */
export type PickRequired<TTarget, TKeys extends keyof TTarget> = {
    -readonly [key in TKeys]: TTarget[key];
}
