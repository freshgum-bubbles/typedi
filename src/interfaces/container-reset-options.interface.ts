/**
 * The strategy to use when resetting a container.
 */
export const enum ContainerResetStrategy {
    /**
     * **Reset the value of each service, while leaving the list
     * of registered services intact.**
     * 
     * This means that any cached instances of individual services
     * are removed, wherein any subsequent calls to the container
     * will return newly-constructed values.
     */
    ResetValue = 'resetValue',

    /**
     * **Reset all services in the container.**
     * 
     * This wipes the container's knowledge of any services 
     * registered under it, while also disposing of individual services.
     * 
     * This means that the attached disposal functionality for services
     * being reset may be called as a result of this operation.
     */
    ResetServices = 'resetServices'
}

/**
 * Options to pass when resetting a container.
 */
export interface ContainerResetOptions {
    /**
     * The reset strategy to use.
     * @see {@link ContainerResetStrategy} for a list of possible options.
     */
    strategy: ContainerResetStrategy | 'resetValue' | 'resetServices';
}
