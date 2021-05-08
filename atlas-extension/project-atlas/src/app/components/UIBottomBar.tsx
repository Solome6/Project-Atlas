import styled from "styled-components";
import { useCamera } from "../hooks/contextHooks";
import { CameraIndicator } from "./CameraIndicator";

const StyledUIBottomBar = styled.div`
    // Layout
    width: 100%;
    padding: 0;
    min-height: 15px;

    display: flex;
    justify-content: flex-end;
    align-items: center;

    border-bottom: 3px solid var(--bgColor);

    // Behavior
    z-index: var(--zIndexFixedUI);

    // Appearance
    background-color: var(--bgColorSecondary);
    filter: drop-shadow(0 1px 5px black);
`;

export default function UITopBar() {
    const [camera] = useCamera();

    return (
        <StyledUIBottomBar>
            <CameraIndicator x={camera.x} y={camera.y} />
        </StyledUIBottomBar>
    );
}
