package atlas;

import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.symbolsolver.model.resolution.TypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.CombinedTypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.JavaParserTypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.ReflectionTypeSolver;
import java.util.List;

public class ParserUtility {

    private final static TypeSolver typeSolver = new CombinedTypeSolver(
        new ReflectionTypeSolver(),
        new JavaParserTypeSolver(DirectoryRootTracker.rootDir));

    /**
     * Determines if a method call actually points to an external file.
     *
     * @return True if the given MethodCallExpression points to an external file, false otherwise.
     */
    public static boolean pointsToExternal(MethodCallExpr methodCallName, List<MethodDeclaration> methods) {
        for (MethodDeclaration md : methods) {
            if (md.getNameAsString().equals(methodCallName.getNameAsString())
                || typeSolver.solveType(methodCallName.getNameAsString()).isJavaLangObject()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determines if a method call actually points to an external file.
     *
     * @return True if the given MethodCallExpression points to an external file, false otherwise.
     */
    public static boolean isChainedExpressionCall(MethodCallExpr methodCallName, List<MethodDeclaration> methods) {
        for (MethodDeclaration md : methods) {
            if (md.getNameAsString().equals(methodCallName.getNameAsString())
                || typeSolver.solveType(methodCallName.getNameAsString()).isJavaLangObject()) {
                return false;
            }
        }
        return true;
    }
}
