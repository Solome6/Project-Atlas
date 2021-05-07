import { ReactNode, useEffect } from "react";
import { useProject } from "../hooks/contextHooks";
import { APIMessage, APIMessageType } from "../models/messages";
import { convertToProject } from "../utils/projectUtils";

export interface MessagingContainerProps {
    children?: ReactNode;
}

export default function MessagingContainer({ children }: MessagingContainerProps) {
    const [project, setProject] = useProject();

    // TODO: TEMP
    useEffect(() => {
        console.log("project:", project);
    }, [project]);

    useEffect(() => {
        const newProjectEventHandler = ({ data: message }: MessageEvent<APIMessage>) => {
            if (message.type === APIMessageType.NewJSONData) {
                setProject(message.data && convertToProject(message.data));
            }
        };

        window.addEventListener("message", newProjectEventHandler);
        return () => {
            window.removeEventListener("message", newProjectEventHandler);
        };
    }, []);

    return <>{children}</>;
}
