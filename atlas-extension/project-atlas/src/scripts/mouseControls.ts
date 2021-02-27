type HTMLSVG = HTMLElement & SVGElement;
type HTMLGroup = HTMLElement & SVGGElement;

(() => {
    interface Camera {
        x: number;
        y: number;
        scale: number;
    }

    enum Mouse {
        SingleClick = 1,
        DoubleClick = 2,
        TripleClick = 3,
    }

    /** The minimum scale of the camera. */
    const MIN_SCALE = 0.05;
    /** The maximum scale of the camera. */
    const MAX_SCALE = 1.5;
    /** The scale multiplier when zooming in. */
    const SCALE_MULTIPLIER = 1.05;
    /** The default horizontal camera translation. */
    const DEFAULT_X = 0;
    /** The default vertical camera translation. */
    const DEFAULT_Y = 0;
    /** The default camera scale. */
    const DEFAULT_SCALE = 0.5;
    /** The class name for disabling select */
    const DISABLE_SELECT = "disable-select";

    /** An object representing the current transformation on the view. */
    const camera = initializeCamera();

    /**
     * Represents whether the user is currently panning the camera.
     *
     * *Primarily used to enable panning over scroll boxes.*
     */
    let panning = true;

    const globalSVG = document.getElementById("globalSVG")! as HTMLSVG;
    const translateSVG = document.getElementById("translateSVG")! as HTMLSVG;
    const scaleGroup = document.getElementById("scaleGroup")! as HTMLGroup;
    const xCoordsElement = document.getElementById("x-coord")! as HTMLSpanElement;
    const yCoordsElement = document.getElementById("y-coord")! as HTMLSpanElement;

    /**
     * A helper function for retrieving the initial camera state.
     */
    function initializeCamera(): Camera {
        return {
            x: DEFAULT_X,
            y: DEFAULT_Y,
            scale: DEFAULT_SCALE,
        };
    }

    /**
     * Applies the transformation represented by the given Camera
     * to the view.
     *
     * @param camera The camera object.
     */
    function applyCamera(camera: Camera) {
        translateSVG.setAttribute("x", String(camera.x));
        translateSVG.setAttribute("y", String(camera.y));
        xCoordsElement.textContent = formatValue(-camera.x);
        yCoordsElement.textContent = formatValue(camera.y);
        scaleGroup.setAttribute("transform", `scale(${camera.scale})`);
    }

    /**
     * Updates the translational values of the view's camera.
     *
     * *Note: This helper functions helps bridge the logic of*
     * *wheel-based and click-based translations. Moreover, future*
     * *constraints to translation logic can be placed here.*
     *
     * @param dx The difference in the x-axis.
     * @param dy The difference in the y-axis.
     */
    function translateCamera(dx: number, dy: number) {
        camera.x += dx;
        camera.y += dy;
    }

    /**
     * A helper function for fixing a given value between
     * some minimum and maximum value.
     *
     * @param min The minimum value.
     * @param value The value to clamp.
     * @param max The maximum value.
     */
    function clamp(min: number, value: number, max: number): number {
        return Math.max(min, Math.min(value, max));
    }

    /**
     * Formats a given value as an integer if given an integer,
     * or to two decimal places if given a decimal.
     * @param value The value to format
     * @param mantissaLength The number of places after the decimal point.
     * The default value is 2.
     */
    function formatValue(value: number, mantissaLength: number = 2) {
        const isInteger = value === Math.trunc(value);
        return isInteger ? String(value) : value.toFixed(mantissaLength);
    }

    /**
     * The click-based translation handler.
     *
     * @param mouseEvent The triggered mouse event.
     */
    const mouseTranslationHandler = (mouseEvent: MouseEvent) => {
        panning = true;
        translateCamera(mouseEvent.movementX, mouseEvent.movementY);
        applyCamera(camera);
    };

    /**
     * The wheel-based translation handler.
     *
     * @param wheelEvent The triggered wheel event.
     */
    const wheelPanHandler = (wheelEvent: WheelEvent) => {
        panning = true;
        translateCamera(-wheelEvent.deltaX, -wheelEvent.deltaY);
        applyCamera(camera);
    };

    /**
     * The wheel-based zoom gesture handler.
     *
     * @param wheelEvent The triggered wheel event.
     */
    const wheelZoomHandler = (wheelEvent: WheelEvent) => {
        let factor;
        if (wheelEvent.deltaY < 0) {
            factor = SCALE_MULTIPLIER;
        } else {
            factor = 1 / SCALE_MULTIPLIER;
        }
        const newScale = clamp(MIN_SCALE, camera.scale * factor, MAX_SCALE);
        if (newScale !== camera.scale) {
            camera.scale = newScale;
            const relativeShift = factor - 1;
            const dx = (wheelEvent.clientX - camera.x) * relativeShift;
            const dy = (wheelEvent.clientY - camera.y) * relativeShift;
            camera.x -= dx;
            camera.y -= dy;
            applyCamera(camera);
        }
    };

    /**
     * A handler to indicate that panning has ended.
     *
     * *Primarily used to enable div scrolling.*
     */
    const stopPanningHandler = () => {
        panning = false;
    };

    /**-----Event Listeners-----*/

    document.addEventListener("mouseleave", () => {
        globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
    });
    globalSVG.addEventListener("mousedown", () => {
        globalSVG.classList.add(DISABLE_SELECT);
        globalSVG.addEventListener("mousemove", mouseTranslationHandler);
    });
    globalSVG.addEventListener("mouseup", () => {
        globalSVG.classList.remove(DISABLE_SELECT);
        globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
    });

    globalSVG.addEventListener("wheel", (wheelEvent) => {
        wheelEvent.preventDefault();
        if (wheelEvent.ctrlKey) {
            wheelZoomHandler(wheelEvent);
        } else {
            wheelPanHandler(wheelEvent);
        }
    });

    globalSVG.addEventListener("click", (mouseEvent) => {
        switch (mouseEvent.detail) {
            case Mouse.DoubleClick: {
                camera.x = DEFAULT_X;
                camera.y = DEFAULT_Y;
                applyCamera(camera);
                break;
            }
            case Mouse.TripleClick: {
                camera.x = DEFAULT_X;
                camera.y = DEFAULT_Y;
                camera.scale = DEFAULT_SCALE;
                applyCamera(camera);
                break;
            }
        }
    });

    document.querySelectorAll("svg.fileBox").forEach((svgFileBox) => {
        const fileBox = svgFileBox as HTMLElement;
        fileBox.addEventListener("mousedown", (mouseEvent) => {
            mouseEvent.stopPropagation();
        });
    });

    document.querySelectorAll("div.scrollBox").forEach((svgFileBox) => {
        const fileBox = svgFileBox as HTMLElement;
        fileBox.addEventListener("wheel", (wheelEvent) => {
            const zooming = wheelEvent.ctrlKey;
            if (!zooming && !panning) {
                wheelEvent.stopPropagation();
            }
        });

        fileBox.addEventListener("mousedown", stopPanningHandler);
        fileBox.addEventListener("mousemove", stopPanningHandler);
    });

    /**-----------------------------------------------------------------------*/
    applyCamera(camera);
})();
