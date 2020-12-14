package atlas.groups;

import com.github.javaparser.ast.body.FieldDeclaration;
import java.util.List;
import java.util.ArrayList;

/**
 * Represents each field of a type of some class from an external file.
 */
public final class FieldGroup implements IFileChildrenGroup {

    private final IGroup parent;
    //private final CodeRegion pointsFrom;
    //private final String pointsTo;

    public FieldGroup(FieldDeclaration fieldDecl, FileGroup parent) {
        this.parent = parent;
        /*
        this.pointsFrom = new CodeRegion(fieldDecl.getBegin().get().line, fieldDecl.getBegin().get().column,
            fieldDecl.getEnd().get().line, fieldDecl.getEnd().get().column, this.getPath());
        */
        //pointsTo = ParserUtility.resolveFieldDeclaration(fieldDecl);
    }

    @Override
    public FileGroup getFileGroup() {
        return (FileGroup) this.parent;
    }

    @Override
    public IGroup getParentGroup() {
        return this.parent;
    }

    @Override
    public List<IGroup> getChildrenGroup() {
        return new ArrayList<>();
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
