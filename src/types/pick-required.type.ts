/**
 * From TTarget, make keys in TKeys required.
 */
export type PickRequired<TTarget, TKeys extends keyof TTarget> = TTarget & Required<Pick<TTarget, TKeys>>;
