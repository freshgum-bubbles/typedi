import { DISPOSE } from "../constants/dispose.const.mjs";
import { Disposable } from "./disposable.type";

export interface ObjectWithSymbolDispose {
    [Symbol.dispose](): void;
}

export interface ObjectWithSymbolAsyncDispose {
    [Symbol.asyncDispose](): Promise<void>;
}

export interface ObjectWithDISymbolDispose {
    [DISPOSE](): void | Promise<void>;
}

export type ObjectWithDisposeMethod = Pick<Disposable, 'dispose'>;
