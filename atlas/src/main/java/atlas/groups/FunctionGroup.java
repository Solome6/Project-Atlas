package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.ast.stmt.BlockStmt;
import java.util.ArrayList;
import java.util.List;

public class FunctionGroup implements IExpressionParentGroup {

    private final MethodDeclaration methodDecl;
    private final IGroup parent;
    private final List<ExpressionGroup> children;
    //private final CodeRegion location;

    public FunctionGroup(MethodDeclaration methodDecl, IGroup parent) {
        this.methodDecl = methodDecl;
        this.parent = parent;
        this.children = new ArrayList<>();
        /*
        this.location = new CodeRegion(methodDecl.getBegin().get().line, methodDecl.getEnd().get().line,
            methodDecl.getBegin().get().column, methodDecl.getEnd().get().column,
            this.getPath());
        */
        this.createChildren();
    }

    private void createChildren() {
        BlockStmt body = methodDecl.getBody().get();
        List<MethodCallExpr> expressions = new ArrayList<>();
        body.findAll(MethodCallExpr.class).forEach(mce -> {
            if (!expressions.isEmpty()) {
                if (mce.getBegin().get().line == expressions.get(expressions.size() - 1).getBegin().get().line
                    && mce.getBegin().get().column == expressions.get(expressions.size() - 1).getBegin().get().column) {
                    expressions.add(expressions.size() - 1, mce);
                    expressions.remove(expressions.size() - 1);
                } else if (
                    mce.getBegin().get().line != expressions.get(expressions.size() - 1).getBegin().get().line) {
                    expressions.add(mce);
                }
            } else {
                expressions.add(mce);
            }
        });
        for (MethodCallExpr expr : expressions) {
            if (ParserUtility.pointsToExternal(expr)) {
                ExpressionGroup expressionGroup = new ExpressionGroup(expr, this);
                this.children.add(expressionGroup);
                ProjectGroup.expressionGroups.add(expressionGroup);
            }
        }
    }

    @Override
    public FileGroup getFileGroup() {
        return (FileGroup) this.parent;
    }

    @Override
    public List<? extends IGroup> getChildrenGroup() {
        return this.children;
    }

    @Override
    public IGroup getParentGroup() {
        return this.parent;
    }

    @Override
    public String getPath() {
        return this.parent.getPath();
    }

}
