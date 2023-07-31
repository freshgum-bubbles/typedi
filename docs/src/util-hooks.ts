import { useState } from 'react';

export function useForceRender() {
  const [, setTempValue] = useState(null);

  function forceRender() {
    setTempValue({});
  }

  return [forceRender] as const;
}
