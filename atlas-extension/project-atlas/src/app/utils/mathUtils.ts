/**
 * A helper function for fixing a given value between
 * some minimum and maximum value.
 *
 * @param min The minimum value.
 * @param value The value to clamp.
 * @param max The maximum value.
 */
export function clamp(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

/**
 * Formats a given value as an integer if given an integer,
 * or to two decimal places if given a decimal.
 * @param value The value to format
 * @param mantissaLength The number of places after the decimal point.
 * The default value is 2.
 */
export function formatValue(value: number, mantissaLength: number = 2) {
    const isInteger = value === Math.trunc(value);
    return isInteger ? String(value) : value.toFixed(mantissaLength);
}
