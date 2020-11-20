package atlas.groups;

import com.github.javaparser.Position;
import com.github.javaparser.ast.expr.MethodCallExpr;
import java.util.List;

public class ExpressionGroup implements IExpressionParentGroup {

    private final Position pos;
    private IExpressionParentGroup parent;
    private FunctionGroup pointer;

    public ExpressionGroup(MethodCallExpr method, IExpressionParentGroup parent) {
        this.parent = parent;
        this.pos = method.getBegin().get();
    }

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
