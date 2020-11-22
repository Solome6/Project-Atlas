import { FileBox, Project, ProjectJSON } from "./extension";

export function convertToProject({ fileBoxes, arrows }: ProjectJSON): Project {
    const fileBoxMap = new Map<string, FileBox>();

    // Object.getOwnPropertyNames(fileBoxes).forEach((name) => {
    //     fileBoxMap.set(name, fileBoxes[name]);
    // });

    fileBoxes.forEach((fileBox) => {
        fileBoxMap.set(fileBox.pathName, fileBox);
    });

    const project: Project = {
        fileBoxes: fileBoxMap,
        arrows,
    };

    return project;
}
