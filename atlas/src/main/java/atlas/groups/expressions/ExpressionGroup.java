package atlas.groups.expressions;

import com.github.javaparser.Position;
import java.util.List;

import atlas.groups.IGroup;
import atlas.groups.FileGroup;

public class ExpressionGroup implements IExpressionParentGroup {

    private String source;
    private Position pos;
    private IExpressionParentGroup parent;

	/**
     *
     *
     * @return the File that the child expressions are apart of
     */
	public FileGroup getFileGroup() {
		// do something
		return null;
	}

	/**
     * Returns the children groups nested inside this IGroup.
     *
     * @return a list of IGroups.
     */
	@Override
    public List<? extends IGroup> getChildrenGroup() {
		// do something
		return null;
	}

    /**
     * @return the main parent IGroup this IGroup is a child of.
     */
	@Override
    public IGroup getParentGroup() {
		// do something
		return null;
	}
}
