import { MutableRefObject, useRef, useState } from "react";

export function useRefState<T>(
    initialValue: T,
): [MutableRefObject<T>, (newValue: Partial<T>) => void] {
    const ref = useRef(initialValue);
    const [state, setState] = useState(ref.current);

    function newSetState(newValue: Partial<T>): void {
        if (typeof newValue === "object") {
            ref.current = { ...ref.current, ...newValue };
        } else {
            ref.current = newValue;
        }
        setState(ref.current);
    }

    return [ref, newSetState];
}
