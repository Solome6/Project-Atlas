import { ReactNode } from "react";
import styled from "styled-components";
import { ModalObject, ModalSize } from "../contexts/Modal";
import { useModalsManager } from "../hooks/contextHooks";

type WidthPercentage = `${number}%`;

interface StyledModalProps {
    size: ModalSize;
    height?: "auto" | ModalSize;
}

type ModalSizeMap = {
    [size in ModalSize]: WidthPercentage;
};

const modalSizeMap = Object.freeze({ small: "30%", medium: "60%", large: "90%" } as ModalSizeMap);

const StyledModal = styled.div`
    // Layout
    margin: auto;

    width: ${({ size }: StyledModalProps) => modalSizeMap[size]};
    height: ${({ height = "auto" }: StyledModalProps) => height};
    max-width: 1100px;
    max-height: 75vh;

    display: flex;
    flex-direction: column;

    padding: 10px;

    // Behavior
    overflow-y: auto;

    // Appearance
    background-color: var(--bgColor);
    border-radius: 10px;
`;

interface CloseBoxContainerProps {
    sticky?: boolean;
}

const CloseButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 15px;

    position: ${({ sticky }: CloseBoxContainerProps) => (sticky ? "sticky" : "unset")};
    top: 0;
`;

const CloseButton = styled.button`
    padding: 5px 10px;

    border: 1px solid var(--textColor);
    border-bottom-width: 2.5px;

    color: var(--textColor);
    background-color: var(--bgColor);

    border-radius: 5px;
    box-shadow: 0 0 5px var(--textSelectionBgColor);

    font-size: 1.2rem;

    :active {
        border-top-width: 2.5px;
        border-bottom-width: 1px;
        box-shadow: none;
        filter: brightness(0.85);
        outline: none;
    }
`;

interface ModalProps {
    size: ModalSize;
    id: ModalObject["id"];
    children?: ReactNode;
    closeable?: boolean;
    stickyClose?: boolean;
}

export default function Modal({ size, children, id, closeable = true, stickyClose = false }: ModalProps) {
    const modalsManager = useModalsManager();

    return (
        <StyledModal size={size}>
            {closeable && (
                <CloseButtonContainer sticky={stickyClose}>
                    <CloseButton onClick={() => modalsManager.removeModal(id)}>X</CloseButton>
                </CloseButtonContainer>
            )}
            <div style={{ padding: "0 15px" }}>{children}</div>
        </StyledModal>
    );
}
