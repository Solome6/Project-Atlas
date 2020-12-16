package atlas.groups;

import atlas.utils.ParserUtility;
import java.util.ArrayList;
import java.util.List;

/**
 * Type of DirectoryGroup that acts as the root node of a Project Tree that will be initialized and traversed to
 * external method call expressions.
 */
public class ProjectGroup extends DirectoryGroup {

    /*
    Static Lists that will be updated of the FileGroups and ExpressionGroups respectively as each are being initialized.
    This saves time when accessing expressionGroups and finding which File and expression points to.

    NOTE:
    This could probably be optimized and refactored with a Map to save on time.
    */
    public static List<FileGroup> fileGroups = new ArrayList<>();
    public static List<IReferencer> referenceGroups = new ArrayList<>();

    /**
     * Constructor to initialize a ProjectGroup.
     *
     * @param rootDir Root Directory of the Java Project to be used in the TypeSolver
     * @param path Source Folder of the Java Project
     * @throws Exception is either of the provided paths don't exist
     */
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
