import { MutableRefObject, useCallback, useRef, useState } from "react";

export function useRefState<T>(
    initialValue: T,
): [MutableRefObject<T>, (newValue: Partial<T>) => void] {
    const ref = useRef(initialValue);
    const [, setState] = useState(0);

    const newSetState = useCallback((newValue: Partial<T>): void => {
        if (typeof newValue === "object") {
            Object.assign<T, Partial<T>>(ref.current, newValue);
        } else {
            ref.current = newValue;
        }
        setState(Math.random());
    }, []);

    return [ref, newSetState];
}
