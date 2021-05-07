import { Project } from "../models/project";
import { FileBox } from "./FileBox";

export interface ProjectVisualizerProps {
    project: Project;
}

export default function ProjectVisualizer({ project }: ProjectVisualizerProps) {
    return (
        <>
            {[...project.fileBoxes].map(([, { source, pathName }], index) => (
                <FileBox
                    content={source}
                    location={{ x: index * 700, y: index * 200 }}
                    pathName={pathName}
                    shortName={pathName.slice(pathName.lastIndexOf("."))}
                />
            ))}
        </>
    );
}
