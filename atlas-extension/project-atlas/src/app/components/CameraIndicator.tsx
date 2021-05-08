import styled from "styled-components";
import { formatValue } from "../utils/mathUtils";

const StyledCameraIndicator = styled.div`
    padding: 0.25rem 0.5rem;

    // Appearance
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
    font-size: 0.75rem;
    color: var(--textSelectionFgColor);
`;

const CameraValue = styled.span`
    & + & {
        margin-left: 5px;
    }
`;

interface CameraIndicatorProps {
    x: number;
    y: number;
}

export function CameraIndicator({ x, y }: CameraIndicatorProps) {
    return (
        <StyledCameraIndicator>
            <CameraValue>X: {formatValue(-x)}</CameraValue>
            <CameraValue>Y: {formatValue(y)}</CameraValue>
        </StyledCameraIndicator>
    );
}
