package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents each Java file in the project
 */
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
        this.setSource(path);
        this.createChildren(path);
    }

    /**
     * Sets the source code of the file to preserve all whitespace
     *
     * @param path The path of this File.
     */
    private void setSource(String path) {
        try {
            StringBuilder builder = new StringBuilder();
            for (String s : Files.readAllLines(Paths.get(path))) {
                builder.append(s).append("\n");
            }
            source = builder.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Initializes the necessary FieldGroups and FunctionGroups from each method in this file.
     *
     * @param path The location of this file.
     * @throws Exception If the file doesn't exist
     */
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
                    for (FieldDeclaration fd : c.getFields()) {
                        if (ParserUtility.isExternalFieldType(fd.getVariable(0))) {
                            FieldGroup currField = new FieldGroup(fd, thisFile);
                            children.add(currField);
                            ProjectGroup.referenceGroups.add(currField);
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
