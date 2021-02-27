package atlas.groups;

import java.util.ArrayList;
import java.util.List;
import java.io.File;
import java.util.Objects;

/**
 * Main class for creating Directory objects of the file tree which will serve to identify
 * which folder a file is in.
 */
public class DirectoryGroup implements IGroup {

    protected final IGroup parent;
    protected List<IGroup> children;
    protected String pckg;

    /**
     * Super constructor used when initializing a Project Group
     */
    public DirectoryGroup() {
        this.parent = null;
        this.children = new ArrayList<>();
    }

    /**
     *  Main constructor to be used whenever a new directory is encountered during traversal.
     */
    public DirectoryGroup(String path, IGroup parent) throws Exception {
        this.children = new ArrayList<>();
        this.parent = parent;
        this.createChildren(path);
    }

    /**
     * Finds all nested directories and files based on the provided path to find Java files to parse.
     * 
     * @param path The path to search for nested elements
     * @throws Exception If the path does not exist
     */
    void createChildren(String path) throws Exception {
        File projectDir = new File(path);
        if(!projectDir.isDirectory()) {
            throw new Exception(projectDir + " is not a directory");
        }
        for (File f : Objects.requireNonNull(projectDir.listFiles())) {
            if (f.isDirectory()) {
                DirectoryGroup dg = new DirectoryGroup(f.getAbsolutePath(), this);
                children.add(dg);
                ProjectGroup.directoryGroups.add(dg);
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
        this.parent.setPackage(pckg);
    }

    @Override
    public String getPackage() {
        return this.pckg;
    }
}
