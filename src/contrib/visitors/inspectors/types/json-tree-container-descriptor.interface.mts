export type JSONTreeContainerIdentifier =
    | { type: 'symbol', description: string }
    | { type: 'string', text: string };

export interface JSONTreeContainerDescriptor {
    readonly identifier: JSONTreeContainerIdentifier;
}
