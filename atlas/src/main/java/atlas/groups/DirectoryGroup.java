package atlas.groups;

import java.util.List;
import java.io.File;

public class DirectoryGroup implements IGroup {

  private IGroup parent;
  private List<IGroup> children;

  public DirectoryGroup(String path) {
    this.parent = null;
    this.createChildren(path);
  }

  public DirectoryGroup(String path, IGroup parent) {
    this.createChildren(path);
  }

  private void createChildren(String path) {
    File projectDir = new File(path);
    for (File f : projectDir.listFiles()) {
        if (f.isDirectory()) {
            children.add(new DirectoryGroup(f.getAbsolutePath(), this));
        } else if (f.getAbsolutePath().endsWith(".java")) {
            children.add(new FileGroup(f.getAbsolutePath(), this));
        }
    }
}

	/**
     * Returns the children groups nested inside this IGroup.
     *
     * @Return a list of IGroups.
     */
    public List<IGroup> getChildrenGroup() {
		// do something
		return this.children;
	}

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
    public IGroup getParentGroup() {
		// do something
		return null;
	}
}