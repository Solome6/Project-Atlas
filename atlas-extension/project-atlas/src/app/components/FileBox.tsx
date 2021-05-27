import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FileScrollBox from "./FileScrollBox";

export interface FileBoxProps {
    pathName: string;
    xLocation: number;
    yLocation: number;
    content: string;
    shortName?: string;
}

const LINE_HEIGHT = 25;
const TITLE_SIZE = 30;
const TITLE_BAR_SIZE = TITLE_SIZE + 10;
const BOX_WIDTH = 600;
const BOX_HEIGHT = 700;

const Title = styled.svg`
    font-family: monospace;
    size: ${TITLE_SIZE}px;
    text-anchor: middle;
`;

const FileBox = memo(function ({ pathName, xLocation, yLocation, content, shortName }: FileBoxProps) {
    const [isInView, setIsInView] = useState(false);
    const fileBoxRef = useRef<SVGSVGElement>(null);

    // Doesn't work because only detects intersection on scroll
    useEffect(() => {
        if (!fileBoxRef.current) {
            return;
        }

        const io = new IntersectionObserver(
            (entries, observer) => {
                console.log("Intersection callback", entries);
                if (entries[0]?.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.75 },
        );
        io.observe(fileBoxRef.current);

        return () => io.disconnect();
    }, [fileBoxRef.current]);

    return (
        <svg
            className="fileBox"
            width={BOX_WIDTH}
            height={BOX_HEIGHT}
            x={xLocation}
            y={yLocation}
            ref={fileBoxRef}
        >
            <Title className="title" x="0" y="0" height={TITLE_BAR_SIZE}>
                <rect width="100%" height="100%" fill="red"></rect>
                <text fontSize="30px" fill="white" textAnchor="middle" x="50%" y="30">
                    <tspan>${shortName || pathName}</tspan>
                </text>
            </Title>
            <foreignObject x="0" y={TITLE_BAR_SIZE} width="100%" height="80%">
                {isInView ? (
                    <FileScrollBox content={content}></FileScrollBox>
                ) : (
                    <div style={{ height: "570px" }}> Loading...</div>
                )}
            </foreignObject>
        </svg>
    );
});

export default FileBox;
