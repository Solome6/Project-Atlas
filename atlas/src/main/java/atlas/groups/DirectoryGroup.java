package atlas.groups;

import java.util.ArrayList;
import java.util.List;
import java.io.File;
import java.util.Objects;

public class DirectoryGroup implements IGroup {

    private final IGroup parent;
    private List<IGroup> children;
    private String path;

    public DirectoryGroup(String path) throws Exception {
        this.parent = null;
        this.children = new ArrayList<>();
        this.createChildren(path);
        this.path = path;
    }

    public DirectoryGroup(String path, IGroup parent) throws Exception {
        this.parent = parent;
        this.createChildren(path);
    }

    private void createChildren(String path) throws Exception {
        File projectDir = new File(path);
        for (File f : Objects.requireNonNull(projectDir.listFiles())) {
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
        return this.parent;
    }

    @Override
    public String getPath() {
        return this.path;
    }
}
