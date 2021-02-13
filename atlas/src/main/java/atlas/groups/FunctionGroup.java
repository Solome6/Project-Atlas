package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.ast.body.InitializerDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.Expression;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.ast.stmt.BlockStmt;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents each method from a file.
 */
public class FunctionGroup implements IExpressionParentGroup {

    private final MethodDeclaration methodDecl;
    private final IGroup parent;
    private final List<ExpressionGroup> children;

    public FunctionGroup(MethodDeclaration methodDecl, IGroup parent) {
        this.methodDecl = methodDecl;
        this.parent = parent;
        this.children = new ArrayList<>();
        this.createChildren();
    }

    /**
     * Initializes the necessary ExpressionGroups from this method where an ExpressionGroup refers to a method call that points to
     * some external file present in the project.
     */
    private void createChildren() {
        BlockStmt body = methodDecl.getBody().get();
        List<MethodCallExpr> expressions = new ArrayList<>();
        body.getStatements().forEach(stmnt -> stmnt.findAll(Expression.class).forEach(e -> {
            if (e.isMethodCallExpr()) {
                MethodCallExpr mce = (MethodCallExpr) e;
                if (!expressions.isEmpty() && mce.getBegin().get().line == expressions.get(expressions.size() - 1).getBegin().get().line
                    && mce.getBegin().get().column == expressions.get(expressions.size() - 1).getBegin().get().column) {
                    expressions.add(expressions.size() - 1, mce);
                    expressions.remove(expressions.size() - 2);
                } else {
                    expressions.add(mce);
                }
            }
        }));
        for (MethodCallExpr expr : expressions) {
            if (ParserUtility.isExternalMethodCall(expr)) {
                this.addExpression(expr);
            }
        }
    }

    private void addExpression(MethodCallExpr expr) {
        ExpressionGroup expressionGroup = new ExpressionGroup(expr, this);
        this.children.add(expressionGroup);
        ProjectGroup.referenceGroups.add(expressionGroup);
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
    public void setPackage(String pckg) {
        this.parent.setPackage(pckg);
    }

    @Override
    public String getPackage() {
        return this.parent.getPackage();
    }

}
