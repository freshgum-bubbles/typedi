import React from 'react';
import { default as OriginalCodeBlock } from '@theme-original/CodeBlock';

export default function CodeBlock(props) {
  const { title } = props;

  // Guard against non-closed quotes, as I keep doing that.
  // It's better to throw than fix it here, as it looks weird in the Markdown too.
  if (title?.startsWith('"') && !title?.endsWith('"')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unterminated quote detected in code-block: ${title}.`);
  }

  return (
    <>
      <OriginalCodeBlock {...props} />
    </>
  );
}
