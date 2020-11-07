package atlas.groups.expressions;

import atlas.groups.FileGroup;
import atlas.groups.IFileChildrenGroup;
import atlas.groups.IGroup;
import java.util.List;

public class ChainedExpression extends ExpressionGroup {

	private String expression;

	public ChainedExpression(String expression) {
		this.expression = expression;
	}

	public String toString() {
		return this.expression;
	}

    @Override
    public FileGroup getFileGroup() {
        return null;
    }

    @Override
    public List<? extends IGroup> getChildrenGroup() {
        return null;
    }

    @Override
    public IGroup getParentGroup() {
        return null;
    }
}
