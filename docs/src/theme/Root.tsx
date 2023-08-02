import React from 'react';
import { useMemo } from "react";

export interface Props {
    children: React.ReactNode;
}

export enum EnvironmentType {
    Production = 'production',
    Development = 'development'
}

export const EnvironmentContext = React.createContext(EnvironmentType.Development);

export default function Root ({ children }: Props) {
    const environment: EnvironmentType = useMemo(() => {
        const nodeEnv = process.env.NODE_ENV;

        // Just in case: constrain the node env to these two types.
        const expectedValues: EnvironmentType[] = [
            EnvironmentType.Production,
            EnvironmentType.Development
        ];

        if (expectedValues.includes(nodeEnv as EnvironmentType)) {
            // If the node env is "production" or "development", add that.
            return nodeEnv as EnvironmentType;
        }

        // Otherwise, assume we're in development.
        return EnvironmentType.Development;
    }, [ ]);

    return (
        // Export the environment to the DOM, so we can access it from CSS.
        <div data-environment={environment}>
            <EnvironmentContext.Provider value={environment}>
                {children}
            </EnvironmentContext.Provider>
        </div>
    );
}
