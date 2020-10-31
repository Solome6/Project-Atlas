package atlas.groups;

public class CodeContainer {

	private CodeRegion codeRegion;

	public CodeContainer(CodeRegion codeRegion) {
		this.codeRegion = codeRegion;
	}

	public String toString() {
		return codeRegion.toString();
	}
}
