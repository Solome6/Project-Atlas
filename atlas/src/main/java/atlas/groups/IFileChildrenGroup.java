package atlas.groups;

/**
 * Interface to represent the various children a FileGroup can have.
 */
public interface IFileChildrenGroup extends IGroup {

    /**
     * Serves as a way to get the File that expressions may be inside.
     *
     * @return the File that the child expressions are apart of
     */
	public FileGroup getFileGroup();
}
