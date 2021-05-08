import styled from "styled-components";
import { useModalsManager } from "../hooks/contextHooks";
import Modal from "./Modal";

const GlobalUIView = styled.div`
    // Layout
    width: 100%;
    height: 100%;

    position: absolute;

    // Behavior
    z-index: var(--zIndexFloatingUI);
    pointer-events: none;

    * {
        pointer-events: all;
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

export default function ModalsDisplay() {
    const { modals } = useModalsManager();
    return (
        <GlobalUIView>
            {modals.length > 0 && (
                <ModalWrapper>
                    <Modal size={modals[0].options.size} id={modals[0].id}>
                        {modals[0].content}
                    </Modal>
                </ModalWrapper>
            )}
        </GlobalUIView>
    );
}
