package atlas.groups;

import com.github.javaparser.ast.body.FieldDeclaration;
import java.util.List;
import java.util.ArrayList;

public final class FieldGroup implements IFileChildrenGroup {

    private final IGroup parent;
    private final CodeRegion pos;
//    private final CodeRegion pointsTo;

    public FieldGroup(FieldDeclaration fieldDecl, FileGroup parent) {
        this.parent = parent;
        this.pos = new CodeRegion(fieldDecl.getBegin().get().line, fieldDecl.getBegin().get().column,
            fieldDecl.getEnd().get().line, fieldDecl.getEnd().get().column, this.getPath());

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
