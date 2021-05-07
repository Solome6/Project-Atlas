import * as React from "react";
import { Camera } from "../models/camera";

const CameraContext = React.createContext<Camera | null>(null);
export default CameraContext;
