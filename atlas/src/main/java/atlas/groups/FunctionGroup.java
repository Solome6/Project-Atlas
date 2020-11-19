package atlas.groups;

import atlas.groups.expressions.ExpressionGroup;
import atlas.groups.expressions.IExpressionParentGroup;

import com.github.javaparser.Position;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.Expression;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.ast.stmt.BlockStmt;
import java.util.ArrayList;
import java.util.List;

public class FunctionGroup implements IExpressionParentGroup, IFileChildrenGroup {

    private final MethodDeclaration methodDecl;
    private final IGroup parent;
    private List<ExpressionGroup> childrenGroups;
    private final Position pos;

    public FunctionGroup(MethodDeclaration methodDecl, IGroup parent) {
        this.pos = methodDecl.getBegin().get();
        this.methodDecl = methodDecl;
        this.parent = parent;
        this.createChildren();
    }

    private void createChildren() {
        BlockStmt body = methodDecl.getBody().get();
        List<Expression> expressions = new ArrayList<>();
        body.findAll(MethodCallExpr.class).forEach(mce -> {
            if (mce.getBegin().get().line == expressions.get(expressions.size() - 1).getBegin()
                .get().line
                && mce.getBegin().get().column == expressions.get(expressions.size() - 1).getBegin()
                .get().column) {
                this.childrenGroups.add(this.childrenGroups.size() - 1, new ExpressionGroup(mce, this));
                this.childrenGroups.remove(this.childrenGroups.size() - 1);
                expressions.add(expressions.size() - 1, mce);
                expressions.remove(expressions.size() - 1);
            } else if (
                mce.getBegin().get().line == expressions.get(expressions.size() - 1).getBegin()
                    .get().line
                    && mce.getBegin().get().column != expressions.get(expressions.size() - 1)
                    .getBegin().get().column) {
                childrenGroups.add(new ExpressionGroup(mce, childrenGroups.get(childrenGroups.size() - 1)));
            } else {
                childrenGroups.add(new ExpressionGroup(mce, this));
            }
        });
    }

	public FileGroup getFileGroup() {
		return null;
	}

	/**
     * Returns the children groups nested inside this IGroup.
     *
     * @Return a list of IGroups.
     */
    public List<? extends IGroup> getChildrenGroup() {
		return this.childrenGroups;
	}

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
    public IGroup getParentGroup() {
		return this.parent;
	}

}
