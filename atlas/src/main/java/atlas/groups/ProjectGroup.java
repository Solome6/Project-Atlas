package atlas.groups;

import atlas.utils.DirectoryRootTracker;
import java.util.ArrayList;
import java.util.List;

public class ProjectGroup extends DirectoryGroup {

    public static List<FileGroup> fileGroups = new ArrayList<>();
    public static List<ExpressionGroup> expressionGroups = new ArrayList<>();

    public ProjectGroup(String path) throws Exception {
        super(path, null);
        DirectoryRootTracker.getInstance(path);
    }
}
