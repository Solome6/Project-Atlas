import { useEffect } from "react";
import { useCamera, useProject } from "../hooks/contextHooks";
import { DEFAULT_CAMERA, MAX_SCALE, MIN_SCALE, SCALE_MULTIPLIER } from "../models/camera";
import { Mouse } from "../models/mouse";
import { clamp } from "../utils/mathUtils";
import InfiniteGrid from "./InfiniteGrid";
import ProjectVisualizer from "./ProjectVisualizer";

type HTMLSVG = HTMLElement & SVGElement;

/** The class name for disabling select */
const DISABLE_SELECT = "disable-select";

export default function GraphVisualization() {
    const [camera, setCamera] = useCamera();
    const [project] = useProject();

    useEffect(() => {
        const globalSVG = document.getElementById("globalSVG")! as HTMLSVG;

        /**
         * Updates the translational values of the view's camera.
         * *Note: This helper functions helps bridge the logic of*
         * *wheel-based and click-based translations. Moreover, future*
         * *constraints to translation logic can be placed here.*
         * @param dx The difference in the x-axis.
         * @param dy The difference in the y-axis.
         */
        const translateCamera = (dx: number, dy: number) => {
            const newX = camera.x + dx;
            const newY = camera.y + dy;
            setCamera({ x: newX, y: newY });
        };

        /**
         * The click-based translation handler.
         * @param mouseEvent The triggered mouse event.
         */
        const mouseTranslationHandler = ({ movementX, movementY }: MouseEvent) => {
            if (camera.isPanningEnabled) {
                setCamera({ isPanning: true });
                translateCamera(movementX, movementY);
                setCamera({ isPanning: false });
            }
        };

        /**
         * The wheel-based zoom gesture handler.
         * @param wheelEvent The triggered wheel event.
         */
        const wheelZoomHandler = ({ deltaY, clientX, clientY }: WheelEvent) => {
            const factor = deltaY < 0 ? SCALE_MULTIPLIER : 1 / SCALE_MULTIPLIER;
            const newScale = clamp(MIN_SCALE, camera.scale * factor, MAX_SCALE);
            if (newScale !== camera.scale) {
                setCamera({ scale: newScale });
                const relativeShift = factor - 1;
                const dx = (clientX - camera.x) * relativeShift;
                const dy = (clientY - camera.y) * relativeShift;
                translateCamera(-dx, -dy);
            }
        };

        /**
         * The wheel-based translation handler.
         * @param wheelEvent The triggered wheel event.
         */
        const wheelPanHandler = ({ deltaX, deltaY }: WheelEvent) => {
            if (camera.isPanningEnabled) {
                setCamera({ isPanning: true });
                translateCamera(-deltaX, -deltaY);
                setCamera({ isPanning: false });
            }
        };

        const documentMouseLeaveHandler = () => {
            globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
        };
        const globalSVGMouseDownHandler = () => {
            globalSVG.classList.add(DISABLE_SELECT);
            globalSVG.addEventListener("mousemove", mouseTranslationHandler);
        };
        const globalSVGMouseUpHandler = () => {
            globalSVG.classList.remove(DISABLE_SELECT);
            globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
        };
        const globalSVGWheelHandler = (wheelEvent: WheelEvent) => {
            if (wheelEvent.ctrlKey) {
                wheelZoomHandler(wheelEvent);
            } else {
                wheelPanHandler(wheelEvent);
            }
        };
        const globalSVGClickHandler = (mouseEvent: MouseEvent) => {
            switch (mouseEvent.detail) {
                case Mouse.DoubleClick: {
                    setCamera({ x: DEFAULT_CAMERA.x, y: DEFAULT_CAMERA.y });
                    break;
                }
                case Mouse.TripleClick: {
                    setCamera({
                        x: DEFAULT_CAMERA.x,
                        y: DEFAULT_CAMERA.y,
                        scale: DEFAULT_CAMERA.scale,
                    });
                    break;
                }
            }
        };

        /**-----Event Listeners-----*/
        document.addEventListener("mouseleave", documentMouseLeaveHandler);
        globalSVG.addEventListener("mousedown", globalSVGMouseDownHandler);
        globalSVG.addEventListener("mouseup", globalSVGMouseUpHandler);
        globalSVG.addEventListener("wheel", globalSVGWheelHandler);
        globalSVG.addEventListener("click", globalSVGClickHandler);

        /**-----Event Listeners Cleanup-----*/
        return () => {
            document.removeEventListener("mouseleave", documentMouseLeaveHandler);
            globalSVG.removeEventListener("mousedown", globalSVGMouseDownHandler);
            globalSVG.removeEventListener("mouseup", globalSVGMouseUpHandler);
            globalSVG.removeEventListener("wheel", globalSVGWheelHandler);
            globalSVG.removeEventListener("click", globalSVGClickHandler);
            globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
        };
    }, [camera]);

    return (
        <>
            <InfiniteGrid x={camera.x} y={camera.y} scale={camera.scale} />
            <svg id="globalSVG" width="100%" height="100%">
                <svg x={camera.x} y={camera.y}>
                    <g transform={`scale(${camera.scale})`}>
                        {project && <ProjectVisualizer project={project} />}
                    </g>
                </svg>
            </svg>
        </>
    );
}
