package atlas.groups;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

public class ProjectGroup extends DirectoryGroup {

    private String path;
    private List<IGroup> children;

    public ProjectGroup(String path) {
        super(path, null);
        this.path = path;
        DirectoryRootTracker rt = DirectoryRootTracker.getInstance(path);
    }

    @Override
    public IGroup getParentGroup() {
        return null;
    }
}
