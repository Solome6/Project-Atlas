import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import styled from "styled-components";
import { CameraIndicator } from "./components/CameraIndicator";
import { InfiniteGrid } from "./components/InfiniteGrid";
import { Modal } from "./components/Modal";
import ModalsContext, {
    ModalActionType,
    ModalObject,
    ModalsManager,
    modalsReducer
} from "./contexts/Modal";
import { useRefState } from "./hooks/customHooks";
import {
    Camera,
    createDefaultCamera,
    DEFAULT_CAMERA,
    MAX_SCALE,
    MIN_SCALE,
    SCALE_MULTIPLIER
} from "./models/camera";
import { APIMessage, APIMessageType, WebViewMessageType } from "./models/Messages";
import { clamp } from "./utils/mathUtils";

type HTMLSVG = HTMLElement & SVGElement;

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

const UITopBar = styled.div`
    // Layout
    box-sizing: content-box;
    width: 100%;
    padding: 0;

    display: flex;
    justify-content: space-evenly;
    align-items: center;

    border-top: 3px solid var(--bgColor);

    // Behavior
    z-index: var(--zIndexTopBar);

    // Appearance
    background-color: var(--bgColorSecondary);
    filter: drop-shadow(0 -1px 5px black);
`;

const TopBarButtonContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    overflow-x: overlay;

    background-color: inherit;
`;

const TopBarLogoContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const TopBarButton = styled.button`
    border: none;
    font-size: 1.1rem;

    margin: 0;
    padding: 7px 15px;

    background-color: inherit;
    color: var(--textColor);

    :last-of-type {
        padding-right: 20px;
    }
`;

const ModalWrapper = styled.div`
    // Layout
    position: absolute;
    top: 0;
    bottom: 0;

    width: 100vw;
    height: 100vh;

    display: flex;

    // Behavior
    z-index: var(--zIndexModal);

    // Appearance
    background: rgba(0, 0, 0, 0.33);
`;

/** The class name for disabling select */
const DISABLE_SELECT = "disable-select";

const refreshHandler = () => window.vscode.postMessage({ type: WebViewMessageType.Refresh });
const changeSourceHandler = () =>
    window.vscode.postMessage({ type: WebViewMessageType.ChangeSource });

export function AtlasApp() {
    const modalCountRef = useRef(0);
    const initialCamera = useMemo(createDefaultCamera, []);

    // Camera State
    const [{ current: camera }, setCamera] = useRefState<Camera>(initialCamera);

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
                console.log("messsage:", message.data);
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
        <ModalsContext.Provider value={modalsManager}>
            <UITopBar>
                <TopBarLogoContainer>
                    <img
                        alt="Project Atlas Logo"
                        src={window.assets["logo"]}
                        style={{ height: "28px", marginLeft: "12px" }}
                    />
                </TopBarLogoContainer>
                <TopBarButtonContainer>
                    <TopBarButton
                        title="Change Source"
                        aria-label="Change Source"
                        onClick={changeSourceHandler}
                    >
                        <FaExchangeAlt />
                    </TopBarButton>
                    <TopBarButton
                        title="Refresh Atlas"
                        aria-label="Refresh Atlas"
                        onClick={refreshHandler}
                    >
                        <HiOutlineRefresh />
                    </TopBarButton>
                </TopBarButtonContainer>
            </UITopBar>
            <GlobalUIView>
                {modals.length > 0 && (
                    <ModalWrapper>
                        <Modal size={modals[0].options.size} id={modals[0].id}>
                            {modals[0].content}
                        </Modal>
                    </ModalWrapper>
                )}
                <CameraIndicator x={camera.x} y={camera.y} />
            </GlobalUIView>
            <InfiniteGrid x={camera.x} y={camera.y} scale={camera.scale} key="grid" />
            <svg id="globalSVG" width="100%" height="100%" style={{ zIndex: 1 }}>
                <svg x={camera.x} y={camera.y}>
                    <g transform={`scale(${camera.scale})`}>
                        <rect width="100" height="100" fill="red"></rect>
                    </g>
                </svg>
            </svg>
        </ModalsContext.Provider>
    );
}
