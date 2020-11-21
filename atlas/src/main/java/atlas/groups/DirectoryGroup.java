package atlas.groups;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.io.File;
import java.util.Objects;

public class DirectoryGroup implements IGroup {

    protected final IGroup parent;
    protected List<IGroup> children;
    protected String pckg;

    public DirectoryGroup(String path) {
        this.parent = null;
        this.children = new ArrayList<>();
    }

    public DirectoryGroup(String path, IGroup parent) throws Exception {
        this.children = new ArrayList<>();
        this.parent = parent;
        this.createChildren(path);
    }

    void createChildren(String path) throws Exception {
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
        return this.parent;
    }

    @Override
    public void setPackage(String pckg) {
        this.pckg = pckg;
    }

    @Override
    public String getPackage() {
        return this.pckg;
    }
}
