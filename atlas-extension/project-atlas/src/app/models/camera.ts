/** The minimum scale of the camera. */
export const MIN_SCALE = 0.05;
/** The maximum scale of the camera. */
export const MAX_SCALE = 1.5;
/** The scale multiplier when zooming in. */
export const SCALE_MULTIPLIER = 1.05;
/** The default horizontal camera translation. */
const DEFAULT_X = 0;
/** The default vertical camera translation. */
const DEFAULT_Y = 0;
/** The default camera scale. */
const DEFAULT_SCALE = 0.5;
/** The default camera object. */
export const DEFAULT_CAMERA: Camera = Object.freeze({
    x: DEFAULT_X,
    y: DEFAULT_Y,
    scale: DEFAULT_SCALE,
    isPanning: false,
    isPanningEnabled: true,
});
/** A function that returns default camera object. */
export const createDefaultCamera = (): Camera => ({ ...DEFAULT_CAMERA });

export interface Camera {
    x: number;
    y: number;
    scale: number;
    isPanning: boolean;
    isPanningEnabled: boolean;
}
