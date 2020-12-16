package atlas.utils;

/**
 * Represents the location of a part of code and its path/
 */
public class CodeRegion {

	private final int startLine;
	private final int endLine;
	private final int startCol;
	private final int endCol;
    private final String path;

	/**
	 * Default constructor.
	 */
    public CodeRegion() {
        this.startLine = 0;
        this.startCol = 0;
        this.endCol = 0;
        this.endLine = 0;
        this.path = "";
    }

	/**
	 * Constructor setting all fields.
	 *
	 * @param startLine Int of the line where the code starts
	 * @param endLine Int of the line where the code ends
	 * @param startCol Int of the column where the code starts
	 * @param endCol Int of the column where the code ends
	 * @param path String of the location of the file this code is in
	 */
    public CodeRegion(int startLine, int endLine, int startCol, int endCol, String path) {
		this.startLine = startLine;
		this.endLine = endLine;
		this.startCol = startCol;
		this.endCol = endCol;
		this.path = path;
	}

	/**
	 * The line where this code starts.
	 *
	 * @return The startLine field
	 */
	public int getStartLine() {
		return startLine;
	}

	/**
	 * The line where this code ends.
	 *
	 * @return The endLine field
	 */
	public int getEndLine() {
		return endLine;
	}

	/**
	 * The column where this code starts.
	 *
	 * @return The startCol field
	 */
	public int getStartCol() {
		return startCol;
	}

	/**
	 * The column where this code ends.
	 *
	 * @return The endCol field
	 */
	public int getEndCol() {
		return endCol;
	}

	/**
	 * The location of the file this piece of code is in.
	 *
	 * @return the path field
	 */
	public String getPath() {
        return this.path;
    }

}
