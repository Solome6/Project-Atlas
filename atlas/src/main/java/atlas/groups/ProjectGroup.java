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
    public static List<DirectoryGroup> directoryGroups = new ArrayList<>();
    public static List<FileGroup> fileGroups = new ArrayList<>();
    public static List<IReferencer> referenceGroups = new ArrayList<>();
    protected String path;


    /**
     * Constructor to initialize a ProjectGroup.
     *
     * @param srcPath Source Folder of the Java Project
     * @throws Exception is either of the provided paths don't exist
     */
    public ProjectGroup(String srcPath) throws Exception {
        super();
        this.path = srcPath;
        ParserUtility.setTypeSolver(srcPath);
        ProjectGroup.directoryGroups.add(this);
        super.createChildren(path);
    }

    @Override
    public IGroup getParentGroup() {
        return null;
    }

    @Override
    public void setPackage(String pckg) {
        int lastPeriod = 0;
        for (int i = 0; i < pckg.length(); i++) {
            if (pckg.charAt(i) == '.') {
                lastPeriod = i;
            }
        }
        this.pckg = pckg.substring(0, lastPeriod);
    }
}
