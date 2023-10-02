import { DISPOSE } from "../constants/dispose.const.mjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Disposable } from "./disposable.type.mjs";

/**
 * An object with a {@link Symbol.dispose} member, which is used
 * by the container to dispose of individual services.
 */
export interface ObjectWithSymbolDispose {
    [Symbol.dispose](): void;
}

/**
 * An object with a {@link Symbol.asyncDispose} member, which is used
 * by the container to dispose of individual services in an asynchronous manner.
 */
export interface ObjectWithSymbolAsyncDispose {
    [Symbol.asyncDispose](): Promise<void>;
}

/**
 * An object with the container-supported {@link DISPOSE} member
 * set to a function which returns either nothing, or a Promise
 * containing nothing.
 * 
 * @example
 * Here is an example:
 * ```ts
 * @Service([ ])
 * export class MyService implements ObjectWithDISymbolDispose {
 *   [OnDispose]() { }
 * }
 * ```
 */
export interface ObjectWithDISymbolDispose {
    [DISPOSE](): void | Promise<void>;
}

/**
 * An object implementing a singular disposal method.
 * 
 * This is very similar to {@link Disposable},
 * although the {@link Disposable.disposed | disposed}
 * member is not explicitly required in this rendition.
 */
export interface ObjectWithDisposeMethod {
    dispose(): Promise<void> | void;
}

/**
 * An object implementing any of the 4 disposal methods supported by the container:
 * 
 * @see {@link ObjectWithSymbolDispose | `Symbol.dispose`}
 * @see {@link ObjectWithSymbolAsyncDispose | `Symbol.disposeAsync`}
 * @see {@link ObjectWithDISymbolDispose | `DISPOSE`}
 * @see {@link ObjectWithDisposeMethod | `"dispose"` (legacy; no longer recommended)}
 */
export type AnyDisposableObject =
    | ObjectWithSymbolDispose
    | ObjectWithSymbolAsyncDispose
    | ObjectWithDISymbolDispose
    | ObjectWithDisposeMethod;
