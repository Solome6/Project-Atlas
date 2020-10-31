package atlas.groups;

import java.util.List;
import java.util.ArrayList;

import atlas.groups.expressions.ExpressionGroup;

public class FieldGroup implements IFileMemberGroup {

    public FieldGroup() {

    }

    public FileGroup getFileGroup() {
        return null;
    }

    public IGroup getParentGroup() {
        return null;
    }

    public List<ExpressionGroup> getOccurrences() {
        return null;
    }

    public List<IGroup> getChildrenGroup() {
        return new ArrayList<IGroup>();
    }
}