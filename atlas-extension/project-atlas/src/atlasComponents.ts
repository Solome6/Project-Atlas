import * as svgjs from "@svgdotjs/svg.js";
// @ts-ignore
import { createSVGWindow } from "svgdom";

const window = createSVGWindow();
const document = window.document;
// @ts-ignore
svgjs.registerWindow(window, document); // creates virtual DOM for SVG.js

const SVG = (tag?: string) => {
    return svgjs.SVG(tag) as svgjs.Svg;
};

interface CodeSegment {
    path: string;
    lineStart: number;
    lineEnd: number;
    columnStart: number;
    columnEnd: number;
}

interface Location {
    x: number;
    y: number;
}

type Id = string;

interface FileBoxProps {
    shortName?: string;
    pathName: Id;
    location?: Location;
    content: string;
    // parentGroups: Id[];
}

interface ArrowProps {
    from: CodeSegment;
    to: CodeSegment;
}

export type FileBoxSVG = svgjs.Svg;
type CodeLineSVG = svgjs.G;
export type ArrowSVG = svgjs.Line;

const LINE_HEIGHT = 25;
const TITLE_SIZE = 30;
const TITLE_BAR_SIZE = TITLE_SIZE + 10;
const CODE_SIZE = 20;
const BOX_WIDTH = 600;
const BOX_HEIGHT = 700;

export function createFileBox({
    pathName,
    shortName = pathName,
    location,
    content,
}: FileBoxProps): FileBoxSVG {
    /**
        `<svg class="fileBox" width="400px" height="200px">
            <svg class="title" x="0" y="0" height="20%">
                <rect width="100%" height="100%" fill="red"></rect>
                <text font-size="30px" fill="white" text-anchor="middle" x="50%" y="30">
                    <tspan>${fileName}</tspan>
                </text>
            </svg>
            <foreignobject x="0" y="20%" width="100%" height="80%">
                <div class="scrollBox" style="overflow: scroll; height: 160px">
                    <svg class="classSourceCodeBox" width="400px" height="500px">
                        ... // All lines of code
                    </svg>
                </div>
            </foreignobject>
        </svg>`;
    */

    const contentLines = content.split("\n");

    // @ts-ignore
    const titleBackground = SVG().rect("100%", "100%").addClass("titleBackground").fill("red");
    const titleText = SVG()
        .text(shortName || pathName)
        .addClass("titleText")
        .move(BOX_WIDTH / 2, -TITLE_SIZE)
        .font({
            family: "Monospace",
            size: TITLE_SIZE,
            anchor: "middle",
        })
        .fill("white");
    const title = SVG()
        .addClass("title")
        .height(TITLE_BAR_SIZE)
        .add(titleBackground)
        .add(titleText);

    const scrollBoxBackground = SVG()
        // @ts-ignore
        .rect("100%", "100%")
        .addClass("scrollBoxBackground")
        .fill("#030333");
    const sourceCode = SVG()
        .addClass("classSourceCodeBox")
        .size(
            contentLines.reduce((max, line) => Math.max(max, line.length * CODE_SIZE), 600),
            Math.max(600, contentLines.length * LINE_HEIGHT),
        ); // TODO: Calculate Manually
    // .add(scrollBoxBackground);

    const scrollBoxDiv = SVG(
        `<div class="scrollBox" style="overflow: scroll; height: ${BOX_HEIGHT * 0.8}px"></div>`,
    ).add(sourceCode);

    // @ts-ignore
    const foreignobject = (SVG().foreignObject("100%", "80%") as svgjs.Svg)
        .move("0", TITLE_BAR_SIZE)
        .add(scrollBoxDiv);

    const fileBox = SVG()
        .addClass("fileBox")
        .size(BOX_WIDTH, BOX_HEIGHT)
        .add(title)
        .add(foreignobject)
        .move(location?.x ?? 0, location?.y ?? 0)
        .data("name", shortName);

    contentLines.forEach((line, index) => {
        sourceCode.add(
            createCodeLine(index + 1, line).transform({
                translateY: index * 25,
            }),
        );
    });

    return fileBox;
}

function createCodeLine(lineNumber: number, content: string): CodeLineSVG {
    /**
        <g class="line">
            <rect x="0" y="25" class="line-indicator"></rect>
            <rect x="0" y="25" class="line-number-background"></rect>
            <text y="45" font-size="20px" fill="black" font-family="monospace">2.</text>
            <text x="30" y="45" font-size="20px" fill="black" font-family="monospace">private
                int
                age;</text>
        </g>
     */

    const FONT_PROPS = {
        color: "white",
        family: "Monospace",
        size: CODE_SIZE,
        anchor: "start",
    };

    const digits = Math.floor(Math.log10(lineNumber)) + 1;
    const lineNumberWidth = 20 + digits * 20;

    const lineSVG = SVG().group().addClass("line").data("line-number", lineNumber);
    const lineIndicator = SVG().rect(0, LINE_HEIGHT).addClass("line-indicator");
    const lineNumberBackground = SVG()
        .rect(lineNumberWidth, LINE_HEIGHT)
        .addClass("line-number-background");
    const lineNumberText = SVG().text(`${lineNumber}.`).font(FONT_PROPS).x(10).dy(-5);
    const lineText = SVG()
        .text(content)
        .font(FONT_PROPS)
        .x(35 + digits * 20)
        .dy(-5);
    // preserves white space
    lineText.attr("xml:space", "preserve");

    return lineSVG.add(lineIndicator).add(lineNumberBackground).add(lineNumberText).add(lineText);
    // return lineSVG.add(lineNumberText).add(lineText);
}

function minmax(lowerBound: number, value: number, upperBound: number) {
    let result;
    if (value < lowerBound) {
        result = lowerBound;
    } else if (value > upperBound) {
        result = upperBound;
    } else {
        result = value;
    }
    console.log(lowerBound, result, upperBound);
    return result;
}

export function createArrow(
    { from, to }: ArrowProps,
    fileBoxes: Map<string, FileBoxSVG>,
): ArrowSVG {
    const startFile = fileBoxes.get(from.path)!;
    const endFile = fileBoxes.get(to.path)!;

    /* BUG:
    Currently if an expression is not visible the Y-Values can draw arrows
    not on the box and where the line would be IF the filebox had a larger height
    */

    const startBoxY = startFile.y();
    const startBoxX = startFile.x();
    const endBoxY = endFile.y();
    const endBoxX = endFile.x();

    const startScroll = startFile.findOne(".scrollBox").node.scrollTop || 0;
    const endScroll = endFile.findOne(".scrollBox").node.scrollTop || 0;

    const startLineY = (startFile?.findOne(
        `[data-line-number="${from.lineStart}"]`,
    ) as CodeLineSVG).transform().translateY!; // in pixels
    const endLineY = (endFile?.findOne(
        `[data-line-number="${to.lineStart}"]`,
    ) as CodeLineSVG).transform().translateY!; // in pixels

    console.log(startBoxY, startFile.height());

    return (
        SVG()
            // .line(
            //     startBoxX + (CODE_SIZE / 2) * from.columnStart + 35,
            //     minmax(startBoxY, startBoxY + startLineY + TITLE_BAR_SIZE + (LINE_HEIGHT / 2) - startScroll, startBoxY + BOX_HEIGHT - TITLE_BAR_SIZE),
            //     endBoxX + (CODE_SIZE / 2) * from.lineEnd + 35,
            //     minmax(endBoxY, endBoxY + endLineY + TITLE_BAR_SIZE + (LINE_HEIGHT / 2) - endScroll, endBoxY + BOX_HEIGHT - TITLE_BAR_SIZE)
            // )
            .line(
                startBoxX + (CODE_SIZE / 2) * from.columnStart + 35,
                minmax(
                    startBoxY + TITLE_BAR_SIZE,
                    startBoxY + startLineY + TITLE_BAR_SIZE,
                    startBoxY + BOX_HEIGHT,
                ),
                endBoxX + (CODE_SIZE / 2) * from.lineEnd + 35,
                minmax(
                    endBoxY + TITLE_BAR_SIZE,
                    endBoxY + endLineY + TITLE_BAR_SIZE,
                    endBoxY + BOX_HEIGHT,
                ),
            )
            .addClass("arrow")
            .stroke({ width: 10, color: "green" })
    );
}
