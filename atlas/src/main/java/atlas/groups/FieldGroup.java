package atlas.groups;

import atlas.utils.CodeRegion;
import atlas.utils.ParserUtility;
import com.github.javaparser.ast.body.FieldDeclaration;
import java.util.List;
import java.util.ArrayList;

/**
 * Represents each field of a type of some class from an external file.
 */
public final class FieldGroup implements IReferencer {

    private final IGroup parent;
    private final CodeRegion pointsFrom;
    private final CodeRegion pointsTo;

    /**
     * Represents a field instantiation of a type create from some external file/class
     * @param fieldDecl The JavaParser FieldDeclaration this node refers to
     * @param parent The parent FileFroup this field is in
     */
    public FieldGroup(FieldDeclaration fieldDecl, FileGroup parent) {
        this.parent = parent;
        this.pointsFrom = new CodeRegion(fieldDecl.getBegin().get().line, fieldDecl.getBegin().get().column,
            fieldDecl.getEnd().get().line, fieldDecl.getEnd().get().column, this.getPackage());
        pointsTo = new CodeRegion(1, 1, 1, 1, ParserUtility.resolveFieldDeclaration(fieldDecl));
    }

    @Override
    public FileGroup getFileGroup() {
        return (FileGroup) this.parent;
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
