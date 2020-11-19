package atlas.groups;

import atlas.ParserUtility;
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import java.io.File;
import java.util.List;

public class FileGroup implements IGroup {

    private List<IFileChildrenGroup> childrenGroups;
    private CodeRegion code;
    private final String path;
    private final IGroup parent;

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
            FileGroup thisFile = this;
            new VoidVisitorAdapter<Object>() {
                @Override
                public void visit(ClassOrInterfaceDeclaration c, Object arg) {
                    super.visit(c, arg);
                    code = new CodeRegion(0, 0, c.getEnd().get().line, c.getEnd().get().column);
                    for (FieldDeclaration fd : c.getFields()) {
                        if (ParserUtility.isExternalType(fd)) {
                            childrenGroups.add(new FieldGroup(fd, thisFile));
                        }
                    }
                    for (MethodDeclaration m : c.getMethods()) {
                        if (m.getBody().isPresent()) {
                           childrenGroups.add(new FunctionGroup(m, thisFile));
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
