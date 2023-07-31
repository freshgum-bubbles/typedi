import React from 'react';
import CodeBlock from '@theme-original/CodeBlock';

export default function CodeBlockWrapper(props) {
  const { title } = props;

  // Guard against non-closed quotes, as I keep doing that.
  // It's better to throw than fix it here, as it looks weird in the Markdown too.
  if (title?.startsWith('"') && !title?.endsWith('"')) {
    throw new Error(`Unterminated quote detected in code-block: ${title}.`);
  }

  return (
    <>
      <CodeBlock {...props} />
    </>
  );
}
