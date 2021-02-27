package atlas.groups;

import atlas.utils.CodeRegion;
import atlas.utils.ParserUtility;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents each method call to some external file within the Java project.
 */
public class ExpressionGroup implements IExpressionParentGroup, IReferencer {

    private final IExpressionParentGroup parent;
    private final CodeRegion pointsTo;
    private final CodeRegion pointsFrom;
    private final List<ExpressionGroup> children;

    /**
     * Initializes an expression group based on the provided method and parent and checks for any child expressions.
     * 
     * @param method The Expression that this ExpressionGroup represents
     * @param parent The parent function that this expression is in
     */
    public ExpressionGroup(MethodCallExpr method, IExpressionParentGroup parent) {
        this.parent = parent;
        this.children = new ArrayList<>();
        this.createChildren(method);
        this.pointsFrom = new CodeRegion(method.getBegin().get().line, method.getEnd().get().line,
            method.getBegin().get().column, method.getEnd().get().column, this.getPackage());

        MethodDeclaration dest = ParserUtility.fromMethodCallExpression(method);
        this.pointsTo = new CodeRegion(dest.getBegin().get().line, dest.getEnd().get().line,
            dest.getBegin().get().column, dest.getEnd().get().column,
            this.formatSignature(ParserUtility.getCallSignature(method)));
    }

    /**
     * Initializes any nested method calls that may be from this expression
     * ex: typeA.method1(typeB.method1())
     *
     * @param method the MethodCallExpr of this expression to get the nested calls of
     */
    private void createChildren(MethodCallExpr method) {
        List<MethodCallExpr> methodCalls = method.findAll(MethodCallExpr.class);
        if (methodCalls.size() > 1) {
            for (int i = 1; i < methodCalls.size(); i++) {
                this.children.add(new ExpressionGroup(methodCalls.get(i), this));
            }
        }
    }

    @Override
    public CodeRegion getPointsTo() {
        return this.pointsTo;
    }

    @Override
    public CodeRegion getPointsFrom() {
        return this.pointsFrom;
    }

    @Override
    public FileGroup getFileGroup() {
        return this.parent.getFileGroup();
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
