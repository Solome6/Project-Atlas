import { memo, useState } from "react";
import { FaExchangeAlt, FaTrashAlt } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { MdSettings } from "react-icons/md";
import styled from "styled-components";
import { useCamera } from "../hooks/contextHooks";
import { MAX_SCALE, MIN_SCALE, SCALE_MULTIPLIER } from "../models/camera";
import { WebViewMessageType } from "../models/messages";
import { DropDownMenu } from "./DropDownMenu";

const StyledUITopBar = styled.div`
    // Layout
    width: 100%;
    padding: 0;

    display: flex;
    justify-content: space-evenly;
    align-items: center;

    border-top: 3px solid var(--bgColor);

    // Behavior
    z-index: var(--zIndexFixedUI);

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

const Label = styled.label`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const refreshHandler = () => window.vscode.postMessage({ type: WebViewMessageType.Refresh });
const changeSourceHandler = () => window.vscode.postMessage({ type: WebViewMessageType.ChangeSource });
const unloadProjectHandler = () => window.vscode.postMessage({ type: WebViewMessageType.UnloadProject });

export default function UITopBar() {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showGrid, setShowGrid] = useState(true);

    const [camera, setCamera] = useCamera();

    return (
        <StyledUITopBar>
            <TopBarLeftLogo />
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
                <TopBarRightButtons />
            </TopBarButtonContainer>
        </StyledUITopBar>
    );
}

const TopBarLeftLogo = memo(function () {
    return (
        <>
            <TopBarLogoContainer>
                <img
                    alt="Project Atlas Logo"
                    src={window.staticAssets["logo"]}
                    style={{ height: "28px", marginLeft: "12px" }}
                />
            </TopBarLogoContainer>
        </>
    );
});

const TopBarRightButtons = memo(function () {
    return (
        <>
            <TopBarButton title="Unload Project" aria-label="Unload Project" onClick={unloadProjectHandler}>
                <FaTrashAlt />
            </TopBarButton>
            <TopBarButton title="Change Source" aria-label="Change Source" onClick={changeSourceHandler}>
                <FaExchangeAlt />
            </TopBarButton>
            <TopBarButton title="Refresh Atlas" aria-label="Refresh Atlas" onClick={refreshHandler}>
                <HiOutlineRefresh />
            </TopBarButton>
        </>
    );
});
