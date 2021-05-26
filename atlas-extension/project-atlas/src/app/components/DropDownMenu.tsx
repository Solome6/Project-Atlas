import { ReactNode } from "react";
import styled from "styled-components";

const DropDownMenuContainer = styled.div`
    position: absolute;
    top: 35px;
    right: 5px;

    border: 5px solid var(--bgColor);

    filter: drop-shadow(-2px 2px 5px #242424);
`;

const DropDownMenuContents = styled.div`
    width: 200px;
    min-height: 200px;
    max-height: 400px;

    padding: 10px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 25px 25px;
    grid-auto-flow: row;
    gap: 10px 5px;

    overflow-y: auto;

    background-color: var(--bgColorSecondary);
`;

const Arrow = styled.div`
    --size: 8px;

    position: absolute;
    top: calc(-1 * var(--size) - 5px);
    right: 5px;

    width: 0;
    height: 0;

    border-bottom: var(--size) solid var(--textColor);
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
`;

interface DropDownMenuProps {
    visible?: boolean;
    children?: ReactNode;
}

export function DropDownMenu({ visible = true, children }: DropDownMenuProps) {
    return (
        <DropDownMenuContainer style={{ display: visible ? "initial" : "none" }}>
            <Arrow />
            <DropDownMenuContents>{children}</DropDownMenuContents>
        </DropDownMenuContainer>
    );
}
