package atlas.groups;

import atlas.groups.FileGroup;
import atlas.groups.expressions.ExpressionGroup;
import atlas.groups.expressions.IExpressionParentGroup;
import atlas.groups.IFileMemberGroup;

import java.util.List;

public class FunctionGroup implements IExpressionParentGroup, IFileMemberGroup {

	public FileGroup getFileGroup() {
		// do something
		return null;
	}

    public List<ExpressionGroup> getOccurrences() {
		// do something
		return null;
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