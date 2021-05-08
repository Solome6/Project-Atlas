import styled from "styled-components";
import GraphVisualization from "./GraphVisualization";
import ModalsDisplay from "./ModalDisplay";
import UIBottomBar from "./UIBottomBar";
import UITopBar from "./UITopBar";

const StyledMainView = styled.div`
    // Layout
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100vh;

    // Behavior
    overflow: clip;
`;

export function MainView() {
    return (
        <>
            <ModalsDisplay />
            <StyledMainView>
                <UITopBar />
                <GraphVisualization />
                <UIBottomBar />
            </StyledMainView>
        </>
    );
}
