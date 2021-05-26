import { MutableRefObject, RefObject, useCallback, useRef, useState } from "react";

const INITIAL_STATE = {};

/**
 * A synchronous state hook for mutable values.
 * @param initialValue
 */
export function useRefState<T extends string>(
    initialValue: T | (() => T),
): [RefObject<T>, (newValue: T) => void];

export function useRefState<T extends number>(
    initialValue: T | (() => T),
): [RefObject<T>, (newValue: T) => void];

export function useRefState<T extends boolean>(
    initialValue: T | (() => T),
): [RefObject<T>, (newValue: T) => void];

export function useRefState<T extends object>(
    initialValue: T | (() => T),
): [RefObject<T>, (newValue: Partial<T>) => void];

export function useRefState<T>(initialValue: T | (() => T)): [RefObject<T>, (newValue: Partial<T>) => void] {
    const isInitializedRef = useRef<boolean>(false);
    const stateRef = useRef<T>() as MutableRefObject<T>;
    const [, rerender] = useState(INITIAL_STATE);

    if (!isInitializedRef.current) {
        // @ts-ignore: ignore strict checks that initialValue is a callable function
        stateRef.current = typeof initialValue === "function" ? initialValue() : initialValue;
        isInitializedRef.current = true;
    }

    const newSetState = useCallback((newValue: Partial<T>): void => {
        if (newValue && typeof newValue === "object") {
            Object.assign<T, Partial<T>>(stateRef.current, newValue);
        } else {
            stateRef.current = newValue as T;
        }
        rerender({});
    }, []);

    return [stateRef, newSetState];
}
