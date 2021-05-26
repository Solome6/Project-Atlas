export type CSSVar = `--${string}`;

export function getRootVar(name: CSSVar): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
