import { useState } from "react";

export function useForceRender () {
    const [tempValue, setTempValue] = useState(null);

    function forceRender () {
        setTempValue({});
    }

    return [forceRender] as const;
}