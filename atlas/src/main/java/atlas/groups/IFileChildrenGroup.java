package atlas.groups;

public interface IFileChildrenGroup extends IGroup {

    /**
     * Serves as a way to get the File that expressions may be inside.
     *
     * @return the File that the child expressions are apart of
     */
	public FileGroup getFileGroup();
}
