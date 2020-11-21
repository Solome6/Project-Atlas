package atlas.groups;

import atlas.utils.ParserUtility;
import java.util.ArrayList;
import java.util.List;

public class ProjectGroup extends DirectoryGroup {

    public static List<FileGroup> fileGroups = new ArrayList<>();
    public static List<ExpressionGroup> expressionGroups = new ArrayList<>();

    public ProjectGroup(String rootDir, String path) throws Exception {
        super(path);
        ParserUtility.setTypeSolver(rootDir);
        super.createChildren(path);
    }

    @Override
    public List<IGroup> getChildrenGroup() {
        return super.children;
    }

    @Override
    public IGroup getParentGroup() {
        return null;
    }

    @Override
    public String getPackage() {
        return super.getPackage();
    }
}
