import { MainView } from "./components/MainView";
import CameraContainer from "./containers/CameraContainer";
import MessagingContainer from "./containers/MessagingContainer";
import ProjectContainer from "./containers/ProjectContainer";

export function AtlasApp() {
    return (
        <ProjectContainer>
            <CameraContainer>
                <MessagingContainer>
                    <MainView />
                </MessagingContainer>
            </CameraContainer>
        </ProjectContainer>
    );
}
