package atlas.groups;

import atlas.utils.CodeRegion;

/**
 * Interface representing which types of IGroups have code references
 */
public interface IReferencer extends IFileChildrenGroup{
    /**
     * Line of code the expression points to.
     *
     * @return The CodeRegion that the expression points to
     */
    CodeRegion getPointsTo();

    /**
     * Line of code the expression is at.
     *
     * @return The CodeRegion that the expression is at
     */
    CodeRegion getPointsFrom();
}
