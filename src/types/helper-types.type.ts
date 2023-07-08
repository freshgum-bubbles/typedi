/**
 * From TTarget, make only keys in TKeys required, with the rest being optional.
 */
export type PartialPick<TTarget, TKeys extends keyof TTarget> = Partial<TTarget> & Pick<TTarget, TKeys>;

/**
 * From TTarget, make keys in TKeys required.
 */
export type PickRequired<TTarget, TKeys extends keyof TTarget> = {
    -readonly [key in TKeys]: TTarget[key];
}
