package atlas.groups.expressions;

import atlas.groups.FileGroup;
import atlas.groups.IGroup;
import com.github.javaparser.ast.expr.MethodCallExpr;
import java.util.List;

public class ChainedExpression extends ExpressionGroup {

    private final MethodCallExpr expression;
    private final IExpressionParentGroup parent;

	public ChainedExpression(MethodCallExpr expression, IExpressionParentGroup parent) {
        super(expression, parent);
        this.expression = expression;
        this.parent = parent;
	}

	public String toString() {
		return this.expression.toString();
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
        return this.parent;
    }
}
