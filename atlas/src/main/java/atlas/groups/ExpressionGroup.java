package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import java.util.ArrayList;
import java.util.List;

public class ExpressionGroup implements IExpressionParentGroup {

    private final IExpressionParentGroup parent;
    private final CodeRegion pointsTo;
    private final CodeRegion pointsFrom;
    private final List<ExpressionGroup> children;

    public ExpressionGroup(MethodCallExpr method, IExpressionParentGroup parent) {
        this.parent = parent;
        this.children = new ArrayList<>();
        this.createChildren(method);
        this.pointsFrom = new CodeRegion(method.getBegin().get().line, method.getEnd().get().line,
            method.getBegin().get().column, method.getEnd().get().column, this.getPath());

        MethodDeclaration dest = ParserUtility.fromMethodCallExpression(method);
        this.pointsTo = new CodeRegion(dest.getBegin().get().line, dest.getEnd().get().line,
            dest.getBegin().get().column, dest.getEnd().get().column, ParserUtility.getCallSignature(method));
    }

    private void createChildren(MethodCallExpr method) {

    }

    @Override
    public FileGroup getFileGroup() {
        return this.parent.getFileGroup();
    }

    @Override
    public List<? extends IGroup> getChildrenGroup() {
        // do something
        return null;
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
