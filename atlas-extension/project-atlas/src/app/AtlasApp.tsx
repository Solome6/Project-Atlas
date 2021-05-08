import { MainView } from "./components/MainView";
import CameraContainer from "./containers/CameraContainer";
import MessagingContainer from "./containers/MessagingContainer";
import ModalsContainer from "./containers/ModalsContainer";
import ProjectContainer from "./containers/ProjectContainer";

export function AtlasApp() {
    return (
        <ModalsContainer>
            <ProjectContainer>
                <CameraContainer>
                    <MessagingContainer>
                        <MainView />
                    </MessagingContainer>
                </CameraContainer>
            </ProjectContainer>
        </ModalsContainer>
    );
}
