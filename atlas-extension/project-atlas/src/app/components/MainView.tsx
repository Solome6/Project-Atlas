import { useMemo, useReducer, useRef, useState } from "react";
import { FaExchangeAlt, FaTrashAlt } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { MdSettings } from "react-icons/md";
import styled from "styled-components";
import ModalsContext, { ModalActionType, ModalObject, ModalsManager, modalsReducer } from "../contexts/Modal";
import { useCamera } from "../hooks/contextHooks";
import { MAX_SCALE, MIN_SCALE, SCALE_MULTIPLIER } from "../models/camera";
import { WebViewMessageType } from "../models/messages";
import { DropDownMenu } from "./DropDownMenu";
import GraphVisualization from "./GraphVisualization";
import { Modal } from "./Modal";
import { WelcomeModal } from "./static/WelcomeModal";

const GlobalUIView = styled.div`
    // Layout
    width: 100%;
    height: 100%;

    position: absolute;

    // Behavior
    z-index: var(--zIndexUI);
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

const Label = styled.label`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const refreshHandler = () => window.vscode.postMessage({ type: WebViewMessageType.Refresh });
const changeSourceHandler = () => window.vscode.postMessage({ type: WebViewMessageType.ChangeSource });
const unloadProjectHandler = () => window.vscode.postMessage({ type: WebViewMessageType.UnloadProject });

export function MainView() {
    const modalCountRef = useRef(0);

    const [showDropDown, setShowDropDown] = useState(false);
    const [showGrid, setShowGrid] = useState(true);

    // Camera State
    const [camera, setCamera] = useCamera();

    // Modal States
    const [modals, dispatch] = useReducer<typeof modalsReducer>(modalsReducer, [
        {
            id: -1,
            content: <WelcomeModal />,
            options: { size: "small" },
        },
    ]);

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

    return (
        <ModalsContext.Provider value={modalsManager}>
            <UITopBar>
                <TopBarLogoContainer>
                    <img
                        alt="Project Atlas Logo"
                        src={window.staticAssets["logo"]}
                        style={{ height: "28px", marginLeft: "12px" }}
                    />
                </TopBarLogoContainer>
                <TopBarButtonContainer>
                    <TopBarButton
                        title="Settings"
                        aria-label="Settings"
                        onClick={() => setShowDropDown(!showDropDown)}
                        style={{ position: "relative" }}
                    >
                        <MdSettings />
                    </TopBarButton>
                    <DropDownMenu visible={showDropDown}>
                        <Label>
                            <input
                                title="Show Grid"
                                type="checkbox"
                                defaultChecked={showGrid}
                                onInput={(e) => setShowGrid(!showGrid)}
                            ></input>
                            <span>Show Grid</span>
                        </Label>
                        <Label style={{ gridColumn: "1 / 3" }}>
                            <span>Scale</span>
                            <input
                                title="Scale"
                                type="range"
                                min={MIN_SCALE}
                                max={MAX_SCALE}
                                value={camera.scale}
                                step={camera.scale * (SCALE_MULTIPLIER - 1)}
                                onInput={(e) => setCamera({ scale: Number(e.currentTarget.value) })}
                            ></input>
                        </Label>
                    </DropDownMenu>
                    <TopBarButton
                        title="Unload Project"
                        aria-label="Unload Project"
                        onClick={unloadProjectHandler}
                    >
                        <FaTrashAlt />
                    </TopBarButton>
                    <TopBarButton
                        title="Change Source"
                        aria-label="Change Source"
                        onClick={changeSourceHandler}
                    >
                        <FaExchangeAlt />
                    </TopBarButton>
                    <TopBarButton title="Refresh Atlas" aria-label="Refresh Atlas" onClick={refreshHandler}>
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
            </GlobalUIView>
            <GraphVisualization />
        </ModalsContext.Provider>
    );
}
