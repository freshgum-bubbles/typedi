import React from 'react';
import Link, { Props as LinkProps } from '@docusaurus/Link';
import Admonition, { Props as AdmonitionProps } from '@theme/Admonition';

export function WorkInProgress () {
    return (
        <>
            <Admonition type='danger'>
                **a**
            </Admonition>
        </>
    );
}