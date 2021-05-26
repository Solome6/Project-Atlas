import { ReactNode } from "react";
import CameraManagerContext from "../contexts/Camera";
import { useRefState } from "../hooks/customHooks";
import { Camera, createDefaultCamera } from "../models/camera";

export interface CameraContainerProps {
    children?: ReactNode;
}

export default function CameraContainer({ children }: CameraContainerProps) {
    const [{ current: camera }, setCamera] = useRefState<Camera>(createDefaultCamera);

    return (
        <CameraManagerContext.Provider value={[camera!, setCamera]}>{children}</CameraManagerContext.Provider>
    );
}
