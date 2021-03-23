import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { createDefaultCamera } from "../models/camera";
import { getRootVar } from "../utils/cssUtils";

const StyledCanvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;

    // Behavior
    z-index: var(--zIndexGrid);
`;

interface InfiniteGridProps {
    x: number;
    y: number;
    scale: number;
}

export function InfiniteGrid({ x, y, scale }: InfiniteGridProps) {
    const DEFAULT_CAMERA = useMemo(createDefaultCamera, []);
    const canvasRef = useRef<HTMLCanvasElement>();

    const drawGrid = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = getRootVar("--textColor");
        ctx.lineWidth = 1;

        const { width, height } = canvasRef.current.getBoundingClientRect();

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();

        // draw row lines
        for (let row = -1; row < 21; row++) {
            const yPos =
                (row * (height / 20) + (y % (height / 20))) * (scale / DEFAULT_CAMERA.scale);
            ctx.moveTo(0, yPos);
            ctx.lineTo(width, yPos);
            ctx.stroke();
        }

        // draw column lines
        for (let col = -1; col < 21; col++) {
            const xPos = (col * (width / 20) + (x % (width / 20))) * (scale / DEFAULT_CAMERA.scale);
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, height);
            ctx.stroke();
        }
    };

    useEffect(() => {
        const updateCanvasSize = () => {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            drawGrid();
        };

        updateCanvasSize();

        window.addEventListener("resize", updateCanvasSize);

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        };
    }, [canvasRef.current]);

    useEffect(drawGrid, [x, y, scale]);

    return <StyledCanvas ref={canvasRef}></StyledCanvas>;
}
