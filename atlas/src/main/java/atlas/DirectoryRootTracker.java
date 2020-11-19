package atlas;

/**
 * Singleton class to utilize JavaParser and Java Symbol Solver
 */
public class DirectoryRootTracker {

    private static DirectoryRootTracker root = null;
    public static String rootDir;

    private DirectoryRootTracker(String rootDir) {
        DirectoryRootTracker.rootDir = rootDir;
    }

    public static DirectoryRootTracker getInstance(String rootDir) {
        if (root == null) {
            root = new DirectoryRootTracker(rootDir);
        }
        return root;
    }

    public static DirectoryRootTracker getInstance() {
        if (root == null) {
            throw new IllegalStateException("Instance must be initialized with a directory first.");
        } else {
            return root;
        }
    }
}
