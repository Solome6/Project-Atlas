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
    List<? extends IGroup> getChildrenGroup();

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
    IGroup getParentGroup();

    /**
     * Sets the package location of this FileGroup.
     */
    void setPackage(String pckg);

    /**
     * Retrieves the path a group may be in.
     *
     * @return The String of the path
     */
    String getPackage();
}
