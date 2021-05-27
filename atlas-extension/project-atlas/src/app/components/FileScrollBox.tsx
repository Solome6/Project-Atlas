import { useMemo } from "react";
import styled from "styled-components";
import LineList from "./LineList";

const CODE_SIZE = 20;

const StyledScrollBox = styled.div`
    overflow: "scroll";
    font-size: ${CODE_SIZE};
    height: "570px";
`;

export interface FileScrollBoxProps {
    content: string;
}

export default function FileScrollBox({ content }: FileScrollBoxProps) {
    const contentLines = useMemo(() => content.split("\n"), [content]);

    return (
        <StyledScrollBox>
            <LineList lines={contentLines} />
        </StyledScrollBox>
    );
}
