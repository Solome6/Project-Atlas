package atlas.groups;

import atlas.ParserUtility;
import atlas.groups.expressions.ChainedExpression;
import atlas.groups.expressions.ExpressionGroup;
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.ast.stmt.BlockStmt;
import com.github.javaparser.ast.stmt.ExpressionStmt;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import java.io.File;
import java.io.FileNotFoundException;
import java.security.CodeSource;
import java.util.ArrayList;
import java.util.List;
import com.github.javaparser.JavaParser;

public class FileGroup implements IGroup {

    private List<IFileChildrenGroup> childrenGroups;
    private List<FieldGroup> occurences;
    private CodeSource code;
    private String path;
    private IGroup parent;

    /**
     * Basic constructor to create a FileGroup
     */
    public FileGroup(String path, IGroup parent) throws Exception {
        this.parent = parent;
        this.path = path;
        createChildren(path);
    }

    private void createChildren(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("createChildren: Unable to find file with path=" + path);
        }

        List<MethodCallExpr> expressionCalls = new ArrayList<>();
        List<MethodCallExpr> chainedExpressionCalls = new ArrayList<>();


        new VoidVisitorAdapter<Object>() {
            public void visit(ClassOrInterfaceDeclaration c, Object arg) {
                super.visit(c, arg);
                for (MethodDeclaration m : c.getMethods()) {
                    if (m.getBody().isPresent()) {
                        BlockStmt body = m.getBody().get();
                        body.findAll(ExpressionStmt.class).forEach(exprstmt -> {
                            if (exprstmt.getExpression().isMethodCallExpr()) {
                                MethodCallExpr mce = exprstmt.getExpression().asMethodCallExpr();
                                if (ParserUtility.pointsToExternal(mce, c.getMethods())) {
                                    if (exprstmt.findAll(MethodCallExpr.class).isEmpty()) {
                                        expressionCalls.add(mce);
                                    } else {
                                        chainedExpressionCalls.add(mce);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }.visit(StaticJavaParser.parse(file), null);

        for (MethodCallExpr mce : expressionCalls) {
            ExpressionGroup exg = new ExpressionGroup();
            this.childrenGroups.add(exg);
        }
        for (MethodCallExpr mce : chainedExpressionCalls) {
            ChainedExpression chainedExpr = new ChainedExpression("");
            this.childrenGroups.add(chainedExpr);
        }
    }

    /**
     * Returns the children groups nested inside this IGroup.
     *
     * @return a list of IGroups.
     */
    public List<? extends IGroup> getChildrenGroup() {
        // do something
        return null;
    }

    /**
     * Returns the main parent IGroup this IGroup is a child of.
     */
    public IGroup getParentGroup() {
        // do something
        return null;
    }

    public void addChild(IFileChildrenGroup child) {
        this.childrenGroups.add(child);
    }
}
