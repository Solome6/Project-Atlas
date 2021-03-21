import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import { CameraIndicator } from "./components/CameraIndicator";
import { Modal } from "./components/Modal";
import ModalsContext, {
    ModalActionType,
    ModalObject,
    ModalsManager,
    modalsReducer,
} from "./contexts/Modal";
import { APIMessage, APIMessageType, WebViewMessageType } from "./models/Messages";
import { clamp } from "./utils/mathUtils";

type HTMLSVG = HTMLElement & SVGElement;
type HTMLGroup = HTMLElement & SVGGElement;

enum Mouse {
    SingleClick = 1,
    DoubleClick = 2,
    TripleClick = 3,
}

const GlobalUIView = styled.div`
    width: 100%;
    height: 100%;

    position: absolute;

    pointer-events: none;

    * {
        pointer-events: all;
    }
`;

const UIButtonList = styled.div`
    // Layout
    position: absolute;
    top: 0;
    right: 0;

    height: 300px;
    padding: 10px;

    & > * + * {
        // All sibling children
        margin-top: 15px;
    }

    //Behavior
    overflow-y: auto;
`;

const UIButton = styled.button`
    // Layout
    width: 10rem;
    height: 2rem;

    display: block;

    // Appearance
    color: var(--textColor);
    background: var(--bgColor);
    background-image: linear-gradient(to bottom, transparent, rgb(0, 0, 0, 0.33));

    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
    font-size: 1.05rem;

    outline: white 1px solid;
`;

const ModalWrapper = styled.div`
    // Layout
    position: absolute;
    top: 0;
    bottom: 0;

    width: 100vw;
    height: 100vh;

    display: flex;

    z-index: var(--zIndexModal);

    // Appearance
    background: rgba(0, 0, 0, 0.5);
`;

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

export function AtlasApp() {
    const modalCountRef = useRef(0);

    // Camera States
    const [cameraX, setCameraX] = useState(DEFAULT_X);
    const [cameraY, setCameraY] = useState(DEFAULT_Y);
    const [cameraZoom, setCameraZoom] = useState(DEFAULT_SCALE);
    const [panning, setPanning] = useState(false);

    // Modal States
    const [modals, dispatch] = useReducer<typeof modalsReducer>(modalsReducer, [
        {
            id: -1,
            content: (
                <div>
                    <div>
                        <img
                            style={{ display: "block", margin: "auto" }}
                            src={window.assets["logo"]}
                        ></img>
                    </div>
                    <div style={{ textAlign: "center", marginTop: "25px" }}>
                        Welcome to Project Atlas. Press the X to begin exploring.
                    </div>
                    <div style={{ marginTop: "1000px" }}>
                        I hope whoever is reading this has a great day :)
                    </div>
                </div>
            ),
            options: { size: "small" },
        },
    ]);

    // JSON State
    const [projectJSON, setProjectJSON] = useState(window.initialData);

    useEffect(() => {
        const newProjectEventHandler = ({ data: message }: MessageEvent<APIMessage>) => {
            if (message.type === APIMessageType.NewJSONData) {
                console.log(message.data);
                setProjectJSON(message.data);
            }
        };

        window.addEventListener("message", newProjectEventHandler);

        return () => {
            window.removeEventListener("message", newProjectEventHandler);
        };
    }, []);

    const modalsManager: ModalsManager = useMemo(
        () => ({
            modals: modals,
            addModal: (modalObject: Partial<ModalObject>) => {
                dispatch({
                    type: ModalActionType.AddModal,
                    data: {
                        id: modalCountRef.current,
                        content: "",
                        options: { size: "medium" },
                        ...modalObject,
                    },
                });
                return modalCountRef.current++;
            },
            removeModal: (id: number) => {
                dispatch({ type: ModalActionType.RemoveModal, data: id });
            },
        }),
        [modals],
    );

    useEffect(() => {
        const globalSVG = document.getElementById("globalSVG")! as HTMLSVG;

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
        const translateCamera = (dx: number, dy: number) => {
            const newX = cameraX + dx;
            const newY = cameraY + dy;
            setCameraX(Number(newX.toFixed(2)));
            setCameraY(Number(newY.toFixed(2)));
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
            const newScale = clamp(MIN_SCALE, cameraZoom * factor, MAX_SCALE);
            if (newScale !== cameraZoom) {
                setCameraZoom(newScale);
                const relativeShift = factor - 1;
                const dx = (wheelEvent.clientX - cameraX) * relativeShift;
                const dy = (wheelEvent.clientY - cameraY) * relativeShift;
                translateCamera(-dx, -dy);
            }
        };

        /**
         * The click-based translation handler.
         * @param mouseEvent The triggered mouse event.
         */
        const mouseTranslationHandler = (mouseEvent: MouseEvent) => {
            setPanning(true);
            translateCamera(mouseEvent.movementX, mouseEvent.movementY);
        };

        /**
         * The wheel-based translation handler.
         * @param wheelEvent The triggered wheel event.
         */
        const wheelPanHandler = (wheelEvent: WheelEvent) => {
            // setPanning(true);
            translateCamera(-wheelEvent.deltaX, -wheelEvent.deltaY);
            setPanning(false);
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
            setPanning(false);
            globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
        };
        const globalSVGWheelHandler = (wheelEvent) => {
            wheelEvent.preventDefault();
            if (wheelEvent.ctrlKey) {
                wheelZoomHandler(wheelEvent);
            } else {
                wheelPanHandler(wheelEvent);
            }
        };
        const globalSVGClickHandler = (mouseEvent) => {
            switch (mouseEvent.detail) {
                case Mouse.DoubleClick: {
                    setCameraX(DEFAULT_X);
                    setCameraY(DEFAULT_Y);
                    break;
                }
                case Mouse.TripleClick: {
                    setCameraX(DEFAULT_X);
                    setCameraY(DEFAULT_Y);
                    setCameraZoom(DEFAULT_SCALE);
                    break;
                }
            }
        };

        if (panning) {
            globalSVGMouseDownHandler();
        }

        /**-----Event Listeners-----*/
        document.addEventListener("mouseleave", documentMouseLeaveHandler);
        globalSVG.addEventListener("mousedown", globalSVGMouseDownHandler);
        globalSVG.addEventListener("mouseup", globalSVGMouseUpHandler);
        globalSVG.addEventListener("wheel", globalSVGWheelHandler);
        globalSVG.addEventListener("click", globalSVGClickHandler);

        return () => {
            document.removeEventListener("mouseleave", documentMouseLeaveHandler);
            globalSVG.removeEventListener("mousedown", globalSVGMouseDownHandler);
            globalSVG.removeEventListener("mouseup", globalSVGMouseUpHandler);
            globalSVG.removeEventListener("wheel", globalSVGWheelHandler);
            globalSVG.removeEventListener("click", globalSVGClickHandler);
            globalSVG.removeEventListener("mousemove", mouseTranslationHandler);
        };
    }, [[cameraX, cameraY, cameraZoom]]);

    const refreshHandler = () => window.vscode.postMessage({ type: WebViewMessageType.Refresh });
    const changeSourceHandler = () =>
        window.vscode.postMessage({ type: WebViewMessageType.ChangeSource });

    return (
        <ModalsContext.Provider value={modalsManager}>
            <GlobalUIView>
                {modals.length > 0 && (
                    <ModalWrapper>
                        <Modal size={modals[0].options.size} id={modals[0].id}>
                            {modals[0].content}
                        </Modal>
                    </ModalWrapper>
                )}
                <UIButtonList>
                    <UIButton onClick={refreshHandler}>Refresh Atlas</UIButton>
                    <UIButton onClick={changeSourceHandler}>Change Source</UIButton>
                </UIButtonList>
                <CameraIndicator x={cameraX} y={cameraY}></CameraIndicator>
            </GlobalUIView>
            <svg id="globalSVG" width="100%" height="100%">
                <svg id="translateSVG" x={cameraX} y={cameraY}>
                    <g id="scaleGroup" transform={`scale(${cameraZoom})`}>
                        <rect width="100" height="100" fill="red"></rect>
                    </g>
                </svg>
            </svg>
        </ModalsContext.Provider>
    );
}
