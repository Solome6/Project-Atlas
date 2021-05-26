import { ReactNode, useMemo, useState } from "react";
import ProjectManagerContext, { ProjectManager } from "../contexts/Project";
import { Project } from "../models/project";

export interface ProjectContainerProps {
    children?: ReactNode;
}

export default function ProjectContainer({ children }: ProjectContainerProps) {
    const [project, setProject] = useState<Project | null>(null);
    const projectManager: ProjectManager = useMemo(() => [project, setProject], [project]);

    return <ProjectManagerContext.Provider value={projectManager}>{children}</ProjectManagerContext.Provider>;
}
