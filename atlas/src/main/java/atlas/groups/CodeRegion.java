package atlas.groups;

public class CodeRegion {

	private final int startLine;
	private final int endLine;
	private final int startCol;
	private final int endCol;
    private final String path;


    public CodeRegion(int startLine, int endLine, int startCol, int endCol, String path) {
		this.startLine = startLine;
		this.endLine = endLine;
		this.startCol = startCol;
		this.endCol = endCol;
		this.path = path;
	}

	public int getStartLine() {
		return startLine;
	}

	public int getEndLine() {
		return endLine;
	}

	public int getStartCol() {
		return startCol;
	}

	public int getEndCol() {
		return endCol;
	}

	public String getPath() {
        return this.path;
    }

}
