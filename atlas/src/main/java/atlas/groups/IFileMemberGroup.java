package atlas.groups;

import java.util.List;

import atlas.groups.expressions.ExpressionGroup;

/**
 * the interface of the parent interface of FieldGroups and FunctionGroups.
 */
public interface IFileMemberGroup extends IGroup {

    /**
     * Serves as a way to get the File that expressions may be inside.
     *
     * @Return the File that the child expressions are apart of
     */
    public FileGroup getFileGroup();

    /**
     * Tracks which expressions call this.
     *
     * @Return the list of occurrences of expressions that call this.
     */
    public List<ExpressionGroup> getOccurrences();
}