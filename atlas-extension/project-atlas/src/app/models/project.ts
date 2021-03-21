export interface CodeBlock {
    path: string;
    lineStart: number;
    lineEnd: number;
    columnStart: number;
    columnEnd: number;
}

export interface FileBox {
    pathName: string;
    source: string;
    fileName: string;
}

export interface Arrow {
    from: CodeBlock;
    to: CodeBlock;
}

export interface ProjectJSON {
    fileBoxes: FileBox[];
    arrows: Arrow[];
}

export interface Project {
    fileBoxes: Map<string, FileBox>;
    arrows: Arrow[];
}
