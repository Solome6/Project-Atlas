import { MutableRefObject, useCallback, useRef, useState } from "react";

const INITIAL_STATE = {};
export function useRefState<T>(initialValue: T): [MutableRefObject<T>, (newValue: Partial<T>) => void] {
    const ref = useRef<T>(initialValue);
    const [, setState] = useState(INITIAL_STATE);

    const newSetState = useCallback((newValue: Partial<T>): void => {
        if (newValue && typeof newValue === "object") {
            Object.assign<T, Partial<T>>(ref.current, newValue);
        } else {
            ref.current = newValue as T;
        }
        setState({});
    }, []);

    return [ref, newSetState];
}
