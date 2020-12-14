package atlas.utils;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.resolution.declarations.ResolvedMethodDeclaration;
import com.github.javaparser.resolution.types.ResolvedReferenceType;
import com.github.javaparser.resolution.types.ResolvedType;
import com.github.javaparser.symbolsolver.JavaSymbolSolver;
import com.github.javaparser.symbolsolver.javaparsermodel.JavaParserFacade;
import com.github.javaparser.symbolsolver.model.resolution.SymbolReference;
import com.github.javaparser.symbolsolver.model.resolution.TypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.CombinedTypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.JavaParserTypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.ReflectionTypeSolver;
import java.util.Optional;

/**
 * Class of utility methods to centralize the use of the JavaParser library.
 */
public class ParserUtility {

    private static TypeSolver typeSolver = new CombinedTypeSolver(new ReflectionTypeSolver());

    public static void setTypeSolver(String path) {
        typeSolver = new CombinedTypeSolver(
            new ReflectionTypeSolver(),
            new JavaParserTypeSolver(path));
        JavaSymbolSolver symbolSolver = new JavaSymbolSolver(typeSolver);
        StaticJavaParser.getConfiguration().setSymbolResolver(symbolSolver);
    }

    public static boolean isExternalType(FieldDeclaration fieldDecl, ClassOrInterfaceDeclaration classDecl) {
        return false;
    }

    /**
     * Determines if a method call expression points to an external file inside the project.
     * @param expr The expression to check
     * @return True if the expression points to an external file, false otherwise
     */
    public static boolean pointsToExternal(MethodCallExpr expr) {
        JavaParserFacade facade = JavaParserFacade.get(typeSolver);

        SymbolReference<ResolvedMethodDeclaration> methodRef = facade.solve(expr);
        ResolvedMethodDeclaration methodDecl = methodRef.getCorrespondingDeclaration();

        Optional<MethodDeclaration> astDecl = methodDecl.toAst();

        return astDecl.isPresent();
    }

    /**
     * Based on a method call expression gets the method that the call points to.
     * @param mce The mce to type solve
     * @return the MethodDeclaration that the expression calls.
     */
    public static MethodDeclaration fromMethodCallExpression(MethodCallExpr mce) {
        JavaParserFacade facade = JavaParserFacade.get(typeSolver);

        SymbolReference<ResolvedMethodDeclaration> methodRef = facade.solve(mce);
        ResolvedMethodDeclaration methodDecl = methodRef.getCorrespondingDeclaration();

        Optional<MethodDeclaration> astDecl = methodDecl.toAst();

        return astDecl.get();
    }

    /**
     * Gets the signature of that the provided expression points to.
     * @param mce The expression to get the signature of
     * @return The String of the signature
     */
    public static String getCallSignature(MethodCallExpr mce) {
        JavaParserFacade f = JavaParserFacade.get(typeSolver);
        SymbolReference<ResolvedMethodDeclaration> methodRef = f.solve(mce);
        ResolvedMethodDeclaration methodDecl = methodRef.getCorrespondingDeclaration();
        return methodDecl.getQualifiedSignature();
    }

    /**
     * Type solves a field declaration to get the signature of the file this field type points to.
     * @param fd The FieldDeclaration to solve
     * @return The signature of the file of the provided field
     */
    public static String resolveFieldDeclaration(FieldDeclaration fd) {
        String resolvedName = "";

        JavaSymbolSolver symbolSolver = new JavaSymbolSolver(typeSolver);
        StaticJavaParser.getConfiguration().setSymbolResolver(symbolSolver);

        ResolvedType rt = fd.getVariables().get(0).getType().resolve();
        if (rt.isReferenceType()) {
            ResolvedReferenceType resolvedReferenceType = rt.asReferenceType();
            resolvedName = resolvedReferenceType.getQualifiedName();
        }

        return resolvedName;
    }
}
