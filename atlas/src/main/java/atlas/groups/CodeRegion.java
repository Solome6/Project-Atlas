package atlas.groups;

public class CodeRegion {

	private final int startLine;
	private final int endLine;
	private final int startCol;
	private final int endCol;

	public CodeRegion(int startLine, int endLine, int startCol, int endCol) {
		this.startLine = startLine;
		this.endLine = endLine;
		this.startCol = startCol;
		this.endCol = endCol;
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

}
