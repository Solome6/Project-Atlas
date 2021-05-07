### Some Notes on V8 Performance

-   `Math.random()` is slow. Only use it for simulating actual randomness. If just a unique value is needed, use an empty object literal since its reference is guaranteed to be different.
-   ~~If a function needs to be redefined <ins>_really_</ins> often, keep it small; function declaration speed grows with instruction count. Extract only large amounts of static behavior to into helper functions, with any dynamic values as parameters.~~

#### Example

```tsx
// Assume Menu is a component that rerenders very frequently

// Avoid doing this:
function Menu() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetch(`http://someURL/api/${count}`).then(console.log);

        const n = Math.floor(count);
        let arr = [0, 1];
        if (n <= 2) return 1;
        for (let i = 2; i <= n; i++) {
            arr[i] = arr[i - 1] + arr[i - 2];
        }
        console.log(arr[n]);

    }, [count]);

    return ...
}

// Do this instead (only slightly better):
function fib(count: number): void {
    const n = Math.floor(count);
    let arr = [0, 1];
    if (n <= 2) return 1;
    for (let i = 2; i <= n; i++) {
        arr[i] = arr[i - 1] + arr[i - 2];
    }
    console.log(arr[n]);
}

function Menu() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetch(`http://someURL/api/${count}`).then(console.log);
        fib(count);
    }, [count]);

    return ...
}
```

-   Use closures as a tool for encapsulation and dynamic evaluation. Don't rely on it frequently to avoid function parameters. Climbing the variable scope chain is expensive.
-   Object declarations with existing values are faster than function declarations.
-   Memoize functions when possibly.
-   It is typically faster to compare references than it is to compare long strings.
-   V8 does not support Tail Call Optimization (TCO).
-   Perform animations using `requestAnimationFrame`.
-   Postpone non-essential work with `requestIdleCallback`.
-   Throttle and debounce computationally expensive operations when possible.
-   Use Web Workers to parallelize extremely slow and complex code.
-   Make micro-optimizations where possible

#### Example
Avoid property lookup on static values:

```ts
for (let i = 0; i < arr.length; i++) {}

// Slightly better
const { length } = arr;
for (let i = 0; i < length; i++) {}
```
See more optimizations [here](https://marcradziwill.com/blog/mastering-javascript-high-performance/#ic).
