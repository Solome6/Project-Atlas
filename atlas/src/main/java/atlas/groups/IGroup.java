package atlas.groups;

import java.util.List;

/**
 * Main interface that rest of the different types of groups will be using.
 */
public interface IGroup {

    /**
     * Returns the children groups nested inside this IGroup.
     *
     * @Return a list of IGroups.
     */
    public List<? extends IGroup> getChildrenGroup();

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
    public IGroup getParentGroup();
}