package atlas.groups;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.ast.stmt.BlockStmt;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import com.github.javaparser.ast.expr.Expression;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.type.Type;

import atlas.groups.expressions.ChainedExpression;
import atlas.groups.expressions.ExpressionGroup;

import java.io.File;
import java.security.CodeSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        this.createChildren(path);
    }

    private void createChildren(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("createChildren: Unable to find file with path=" + path);
        } else {
            List<MethodCallExpr> expressions = new ArrayList<>();

            new VoidVisitorAdapter<Object>() {
                @Override
                public void visit(ClassOrInterfaceDeclaration c, Object arg) {
                    super.visit(c, arg);
                    for (MethodDeclaration m : c.getMethods()) {
                        if (m.getBody().isPresent()) {
                            BlockStmt body = m.getBody().get();
                            body.findAll(MethodCallExpr.class).forEach(mce -> {
                                if (mce.getBegin().get().line == expressions.get(expressions.size() - 1).getBegin()
                                        .get().line
                                        && mce.getBegin().get().column == expressions.get(expressions.size() - 1)
                                                .getBegin().get().column) {
                                    // swap last element with this method call
                                    expressions.set(expressions.size() - 1, mce);
                                } else if (mce.getBegin().get().line == expressions.get(expressions.size() - 1)
                                        .getBegin().get().line
                                        && mce.getBegin().get().column > expressions.get(expressions.size() - 1)
                                                .getBegin().get().column) {
                                    // new Chained Expression
                                    expressions.add(mce);

                                    /*
                                        circle.circumference()
                                        In a.<String>bb(15); a is the scope, String is a type argument, bb is the name and 15 is an argument.
                                    */

                                    Optional<Expression> scope = mce.getScope();
                                    Optional<NodeList<Type>> type = mce.getTypeArguments();
                                    String methodName = mce.getName().asString();
                                    NodeList<Expression> args = mce.getArguments();
                                    ExpressionGroup chainedExpr = new ChainedExpression(methodName);
                                } else {
                                    // new expression
                                }
                            });
                        }
                    }
                }
            }.visit(StaticJavaParser.parse(file), null);
        }
    }

    /**
     * Returns the children groups nested inside this IGroup.
     *
     * @return a list of IGroups.
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

    public void addChild(IFileChildrenGroup child) {
        this.childrenGroups.add(child);
    }
}
