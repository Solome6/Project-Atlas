package atlas.groups;

import java.security.CodeSource;
import java.util.List;
import com.github.javaparser.JavaParser;

public class FileGroup implements IGroup {

  private List<IFileChildrenGroup> childrenGroups;
  private List<FieldGroup> occurences;
  private CodeSource code;
  private String path;
  private IGroup parent;

 /**
 * Basic constructor to create a FileGroup
 */
  public FileGroup(String path, IGroup parent) {
    this.parent = parent;
    this.path = path;
    createChildren(path);
  }

  private void createChildren(String path) throws Exception {
    File file = new File(path);
    if (!file.exists()) {
      throw new Exception("createChildren: Unable to find file with path=" + path);
    }

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
