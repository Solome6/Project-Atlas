package atlas.groups;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;
import com.github.javaparser.StaticJavaParser;

public class ProjectGroup implements IGroup {

    private String path;
    private List<IGroup> children;

    public ProjectGroup(String path) {
        this.path = path;
        this.createChildren();
    }

    private void createChildren() {
        File projectDir = new File(this.path);
        for (File f : projectDir.listFiles()) {
            if (f.isDirectory()) {
                children.add(new DirectoryGroup(f.getAbsolutePath(), this));
            } else if (f.getAbsolutePath().endsWith(".java")) {
                children.add(new FileGroup(f.getAbsolutePath(), this));
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
}
