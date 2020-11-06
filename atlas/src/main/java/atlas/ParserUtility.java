package atlas;

public class ParserUtility {

    private TypeSolver typerSolver;

    public ParserUtility(DirectoryRootTracker root) {
        this.typeSolver = new CombinedTypeSolver(
            new ReflectionTypeSolver(),
            new JavaParserTypeSolver(root.rootDir));
    }

    public static List<MethodCallExpr> findExternalCalls(String filePath) {
        ClassOrInterfaceDeclaration currClass = StaticJavaParser.parse(file);
        List<MethodCallExpr> externalCalls = new ArrayList<>();

        for (MethodDeclaration m : currClass.getMethods()) {
            if (m.getBody().isPresent()) {
              BlockStmt body = m.getBody().get();
              body.findAll(MethodCallExpr.class).forEach(mce -> {
                  // TODO: Matt refine boolean to ignore built in calls (built in methods)
                  if (isExternalMethodCall(mce, currClass.getMethods())) {
                      externalCalls.add(mce);
                  }
              });
            }
          }
          return externalCalls;
    }

    /**
     * Determines if a method call actually points to an external file.
     */
    private boolean isExternalMethodCall(MethodCallExpr methodCallName, List<MethodDeclaration> methods) {
        for (MethodDeclaration md : methods) {
            if (md.getNameAsString().equals(methodCallName.getNameAsString())) {
                return false;
            }
        }
        return true;
    }
}