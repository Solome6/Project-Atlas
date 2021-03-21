import { ReactNode } from "react";
import styled from "styled-components";
import { ModalObject, ModalSize } from "../contexts/Modal";
import { useModalsManager } from "../hooks/contextHooks";

type WidthPercentage = `${number}%`;

interface StyledModalProps {
    size: ModalSize;
    height?: "auto" | ModalSize;
}

function getModalWidthPercentage(size: ModalSize): WidthPercentage {
    switch (size) {
        case "small":
            return "33%";
        case "medium":
            return "50%";
        case "large":
            return "85%";
    }
}

const StyledModal = styled.div`
    // Layout
    margin: auto;

    width: ${({ size }: StyledModalProps) => getModalWidthPercentage(size)};
    height: ${({ height = "auto" }: StyledModalProps) => height};
    max-height: 85vh;

    display: flex;
    flex-direction: column;

    padding: 15px;

    // Behavior
    overflow-y: auto;

    // Appearance
    background-color: var(--bgColor);
    border-radius: 10px;
`;

const CloseBoxContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 15px;

    font-size: 1.2rem;
`;

interface ModalProps {
    size: ModalSize;
    id: ModalObject["id"];
    children?: ReactNode;
    closeable?: boolean;
}

export function Modal({ size, children, id, closeable = true }: ModalProps) {
    const modalsManager = useModalsManager();
    return (
        <StyledModal size={size}>
            {closeable && (
                <CloseBoxContainer>
                    <button onClick={() => modalsManager.removeModal(id)}>X</button>
                </CloseBoxContainer>
            )}
            <div>{children}</div>
        </StyledModal>
    );
}
