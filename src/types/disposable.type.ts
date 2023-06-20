export interface Disposable {
    disposed: boolean;
    dispose (): Promise<void> | void;
}