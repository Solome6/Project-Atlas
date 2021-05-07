import * as React from "react";
import { Camera } from "../models/camera";

export type CameraManager = [Camera, (newCamera: Partial<Camera>) => void];

const CameraManagerContext = React.createContext<CameraManager | null>(null);
export default CameraManagerContext;
