import { useContext } from "react";
import CameraManagerContext, { CameraManager } from "../contexts/Camera";
import ModalsContext, { ModalsManager } from "../contexts/Modal";
import ProjectManagerContext, { ProjectManager } from "../contexts/Project";

export function useModalsManager(): ModalsManager {
    return useContext(ModalsContext)!;
}

export function useCamera(): CameraManager {
    return useContext(CameraManagerContext)!;
}

export function useProject(): ProjectManager {
    return useContext(ProjectManagerContext)!;
}
