package atlas.groups.expressions;

import java.util.List;

import atlas.groups.IGroup;
import atlas.groups.FileGroup;

public class ExpressionGroup implements IExpressionParentGroup {

	/**
     *
     *
     * @Return the File that the child expressions are apart of
     */
	public FileGroup getFileGroup() {
		// do something
		return null;
	}

	/**
     * Returns the children groups nested inside this IGroup.
     *
     * @Return a list of IGroups.
     */
	@Override
    public List<? extends IGroup> getChildrenGroup() {
		// do something
		return null;
	}

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
	@Override
    public IGroup getParentGroup() {
		// do something
		return null;
	}
}