package atlas.groups;

import java.util.List;

public class DirectoryGroup implements IGroup {

  private IGroup parent;
  private List<IGroup> children;

  public DirectoryGroup(String path, IGroup parent) {

  }

	/**
     * Returns the children groups nested inside this IGroup.
     *
     * @Return a list of IGroups.
     */
    public List<? extends IGroup> getChildrenGroup() {
		// do something
		return null;
	}

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
    public IGroup getParentGroup() {
		// do something
		return null;
	}
}