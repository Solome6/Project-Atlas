package atlas;

/**
 * Singleton class to utilize JavaParser and Java Symbol Solver
 */
public class DirectoryRootTracker {

    private static DirectoryRootTracker root = null;
    public static String rootDir;

    private DirectoryRootTracker(String rootDir) {
        this.rootDir = rootDir;
    }

public DirectoryRootTracker getInstance(String rootDir) {
    if (root == null) {
        this.root = this.DirectoryRootTracker(rootDir);
    }
    return this;
}

public DirectoryRootTracker getInstance() {
    if (typeSolver == null) {
        throw new IllegalStateException("Instance must be initialized with a directory first.");
    } else {
        return this;
    }
}






}