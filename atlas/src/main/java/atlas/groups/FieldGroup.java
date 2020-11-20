package atlas.groups;

import atlas.utils.ParserUtility;
import com.github.javaparser.ast.body.FieldDeclaration;
import java.util.List;
import java.util.ArrayList;

public final class FieldGroup implements IFileChildrenGroup {

    private final IGroup parent;
    private final CodeRegion pointsFrom;
    private final String pointsTo;

    public FieldGroup(FieldDeclaration fieldDecl, FileGroup parent) {
        this.parent = parent;
        this.pointsFrom = new CodeRegion(fieldDecl.getBegin().get().line, fieldDecl.getBegin().get().column,
            fieldDecl.getEnd().get().line, fieldDecl.getEnd().get().column, this.getPath());
        pointsTo = ParserUtility.resolveFieldDeclaration(fieldDecl);
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
    public String getPath() {
        return this.parent.getPath();
    }
}
