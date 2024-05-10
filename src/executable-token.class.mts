import { EXECUTABLE_TOKEN, ExecutableTokenStamp } from "./constants/stamps/executable-token.const.mjs";
import { Token } from "./index.mjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ContainerInstance, HostContainer } from "./index.mjs";

/**
 * A token which does not immediately reference a value in a container.
 * Instead, the value it holds is attained dynamically, by way of its {@link ExecutableToken.execute} method.
 *
 * @example
 * ```
 * export class MyExecutableToken extends ExecutableToken<string> {
 *   execute (subject: ContainerInstance) {
 *     return "hello world!";
 *   }
 * }
 *
 * Container.get(MyExecutableToken); // -> "hello world!"
 * ```
 *
 * @remarks
 * Another example of an {@link ExecutableToken} would be {@link HostContainer}.
 */
export abstract class ExecutableToken<T> extends Token<T> {
    /**
     * A function which, when executed upon a container, performs a function.
     *
     * The performed function is undefined, but should generally pertain to the container
     * it is called against.
     *
     * @param subject - The container the token is being executed upon.
     */
    abstract execute (subject: ContainerInstance): T;

    /**
     * A stamp to quickly differentiate between non-executable and executable tokens.
     * This should not be relied upon by external consumers.
     *
     * @private
     */
    [EXECUTABLE_TOKEN] = ExecutableTokenStamp.Generic;
}

export function isExecutableToken (x: any): x is ExecutableToken<unknown> {
    return x != null && x[EXECUTABLE_TOKEN] == ExecutableTokenStamp.Generic;
}
