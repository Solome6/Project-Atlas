import * as React from "react";
import { Project } from "../models/project";

export type ProjectManager = [Project | null, (newProject: Project | null) => void];

const ProjectManagerContext = React.createContext<ProjectManager | null>(null);
export default ProjectManagerContext;
