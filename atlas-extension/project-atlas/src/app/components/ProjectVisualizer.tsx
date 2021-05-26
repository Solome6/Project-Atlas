import { memo } from "react";
import { Project } from "../models/project";
import FileBox from "./FileBox";

export interface ProjectVisualizerProps {
    project: Project;
}

const ProjectVisualizer = memo(function ({ project }: ProjectVisualizerProps) {
    return (
        <>
            {[...project.fileBoxes].map(([, { source, pathName }], index) => (
                <FileBox
                    key={index}
                    content={source}
                    xLocation={index * 700}
                    yLocation={index * 200}
                    pathName={pathName}
                    shortName={pathName.slice(pathName.lastIndexOf("."))}
                />
            ))}
        </>
    );
});

export default ProjectVisualizer;
