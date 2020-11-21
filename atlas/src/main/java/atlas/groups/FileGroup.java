package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class FileGroup implements IGroup {

    private final List<IFileChildrenGroup> children;
    private final IGroup parent;
    private String source;
    private String pckg;

    /**
     * Basic constructor to create a FileGroup
     */
    public FileGroup(String path, IGroup parent) throws Exception {
        this.parent = parent;
        this.children = new ArrayList<>();
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
                    setPackage(c.getFullyQualifiedName().get());
                    setParentPackage(c.getFullyQualifiedName().get());
                    source = c.toString();
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

    public String getSource() {
        return this.source;
    }

    private void setParentPackage(String pckg) {
        int finalPeriod = 0;
        for (int i = 0; i < pckg.length(); i++) {
            if (pckg.charAt(i) == '.') {
                finalPeriod = i;
            }
        }
        this.parent.setPackage(pckg.substring(0, finalPeriod));
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
        this.pckg = pckg;
    }

    @Override
    public String getPackage() {
        return this.pckg;
    }

}
