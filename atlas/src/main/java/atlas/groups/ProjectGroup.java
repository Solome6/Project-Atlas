package atlas.groups;

import atlas.utils.ParserUtility;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ProjectGroup implements IGroup {

    public static List<FileGroup> fileGroups = new ArrayList<>();
    public static List<ExpressionGroup> expressionGroups = new ArrayList<>();
    private final List<IGroup> children;
    private final String path;

    public ProjectGroup(String rootDir, String path) throws Exception {
        ParserUtility.setTypeSolver(rootDir);
        this.path = path;
        this.children = new ArrayList<>();
        this.createChildren(path);
    }

    private void createChildren(String path) throws Exception {
        File projectDir = new File(path);
        if(!projectDir.isDirectory()) {
            throw new Exception(projectDir + " is not a directory");
        }
        for (File f : Objects.requireNonNull(projectDir.listFiles())) {
            if (f.isDirectory()) {
                children.add(new DirectoryGroup(f.getAbsolutePath(), this));
            } else if (f.getAbsolutePath().endsWith(".java")) {
                IGroup fileGroup = new FileGroup(f.getAbsolutePath(), this);
                children.add(fileGroup);
                ProjectGroup.fileGroups.add((FileGroup) children.get(children.size() - 1));
            }
        }
    }


    @Override
    public List<IGroup> getChildrenGroup() {
        return this.children;
    }

    @Override
    public IGroup getParentGroup() {
        return null;
    }

    @Override
    public String getPath() {
        return this.path;
    }
}
