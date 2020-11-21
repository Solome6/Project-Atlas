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
            method.getBegin().get().column, method.getEnd().get().column, this.getPackage());

        MethodDeclaration dest = ParserUtility.fromMethodCallExpression(method);
        this.pointsTo = new CodeRegion(dest.getBegin().get().line, dest.getEnd().get().line,
            dest.getBegin().get().column, dest.getEnd().get().column,
            this.formatSignature(ParserUtility.getCallSignature(method)));
    }

    private void createChildren(MethodCallExpr method) {
        List<MethodCallExpr> methodCalls = method.findAll(MethodCallExpr.class);
        if (methodCalls.size() > 1) {
            for (int i = 1; i < methodCalls.size(); i++) {
                this.children.add(new ExpressionGroup(methodCalls.get(i), this));
            }
        }
    }

    private String formatSignature(String sig) {
        int finalPeriod = 0;
        for (int i = 0; i < sig.length(); i++) {
            if (sig.charAt(i) == '.') {
                finalPeriod = i;
            } else if (sig.charAt(i) == '(') {
                break;
            }
        }
        return sig.substring(0, finalPeriod);
    }

    public CodeRegion getPointsTo() {
        return this.pointsTo;
    }

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
