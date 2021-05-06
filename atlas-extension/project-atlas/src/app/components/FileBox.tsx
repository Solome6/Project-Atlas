import { useMemo } from "react";
import styled from "styled-components";

export interface FileBoxProps {
    pathName: string;
    location: { x: number; y: number };
    content: string;
    shortName?: string;
}

const LINE_HEIGHT = 25;
const TITLE_SIZE = 30;
const TITLE_BAR_SIZE = TITLE_SIZE + 10;
const CODE_SIZE = 20;
const BOX_WIDTH = 600;
const BOX_HEIGHT = 700;

const Title = styled.svg`
    font-family: monospace;
    size: ${TITLE_SIZE}px;
    text-anchor: middle;
`;

export function FileBox({ pathName, location: { x, y }, content, shortName }: FileBoxProps) {
    const contentLines = useMemo(() => content.split("\n"), [content]);

    return (
        <svg className="fileBox" width={BOX_WIDTH} height={BOX_HEIGHT} x={x} y={y}>
            <Title className="title" x="0" y="0" height={TITLE_BAR_SIZE}>
                <rect width="100%" height="100%" fill="red"></rect>
                <text fontSize="30px" fill="white" textAnchor="middle" x="50%" y="30">
                    <tspan>${shortName || pathName}</tspan>
                </text>
            </Title>
            <foreignObject x="0" y={TITLE_BAR_SIZE} width="100%" height="80%">
                <div
                    className="scrollBox"
                    style={{ overflow: "scroll", fontSize: CODE_SIZE, height: "570px" }}
                >
                    {contentLines.map((line, index) => (
                        <div className="line" style={{ transform: `translate(0, ${index * 25})` }}>
                            <span style={{ display: "inline-block", marginInlineEnd: "10px" }}>
                                {index + 1}.
                            </span>
                            <div style={{ display: "inline-block", marginInlineEnd: "10px" }}>{line}</div>
                        </div>
                    ))}
                </div>
            </foreignObject>
        </svg>
    );
}
