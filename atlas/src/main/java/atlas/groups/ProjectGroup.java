package atlas.groups;

import atlas.DirectoryRootTracker;
import java.util.ArrayList;
import java.util.List;

public class ProjectGroup extends DirectoryGroup {

    private final List<IGroup> children;

    public ProjectGroup(String path) throws Exception {
        super(path, null);
        this.children = new ArrayList<>();
        DirectoryRootTracker.getInstance(path);
    }
}
