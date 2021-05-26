import { FileBox, Project, ProjectJSON } from "../models/project";

export function convertToProject({ fileBoxes, arrows }: ProjectJSON): Project {
    const fileBoxMap = new Map<string, FileBox>();

    fileBoxes?.forEach((fileBox) => {
        fileBoxMap.set(fileBox.pathName, fileBox);
    });

    const project: Project = {
        fileBoxes: fileBoxMap,
        arrows,
    };

    return project;
}
