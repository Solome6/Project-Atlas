package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import com.github.javaparser.ast.expr.Expression;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.type.Type;

import atlas.groups.expressions.ChainedExpression;
import atlas.groups.expressions.ExpressionGroup;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FileGroup implements IGroup {

    private final List<IFileChildrenGroup> children;
    private CodeRegion code;
    private final String path;
    private final IGroup parent;

    /**
     * Basic constructor to create a FileGroup
     */
    public FileGroup(String path, IGroup parent) throws Exception {
        this.parent = parent;
        this.path = path;
        this.children = new ArrayList<>();
        this.code = new CodeRegion();
        this.createChildren(path);
    }

    private void createChildren(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("createChildren: Unable to find file with path=" + path);
        } else {
            FileGroup thisFile = this;
            new VoidVisitorAdapter<Object>() {
                @Override
                public void visit(ClassOrInterfaceDeclaration c, Object arg) {
                    super.visit(c, arg);
                    code = new CodeRegion(0, 0, c.getEnd().get().line, c.getEnd().get().column,
                        c.getFullyQualifiedName().get());
                    for (FieldDeclaration fd : c.getFields()) {
                        if (ParserUtility.isExternalType(fd, c)) {
                            children.add(new FieldGroup(fd, thisFile));
                        }
                    }
                    for (MethodDeclaration m : c.getMethods()) {
                        if (m.getBody().isPresent()) {
                            children.add(new FunctionGroup(m, thisFile));
                        }
                    }
                }
            }.visit(StaticJavaParser.parse(file), null);
        }
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
