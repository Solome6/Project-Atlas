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
import java.util.List;
import java.util.Optional;

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

    public static boolean isExternalType(FieldDeclaration fieldDecl, ClassOrInterfaceDeclaration classDecl) {
        TypeSolver typeSolver = new CombinedTypeSolver(
            new ReflectionTypeSolver(),
            new JavaParserTypeSolver(DirectoryRootTracker.rootDir));
        JavaParserFacade.get(typeSolver);

        return false;
    }

    public static MethodDeclaration fromMethodCallExpression(MethodCallExpr mce) {
        JavaParserFacade f = JavaParserFacade.get(typeSolver);
        SymbolReference<ResolvedMethodDeclaration> methodRef = f.solve(mce);
        ResolvedMethodDeclaration methodDecl = methodRef.getCorrespondingDeclaration();

        Optional<MethodDeclaration> astDecl = methodDecl.toAst();

        return astDecl.get();
    }

    public static String getCallSignature(MethodCallExpr mce) {
        JavaParserFacade f = JavaParserFacade.get(typeSolver);
        SymbolReference<ResolvedMethodDeclaration> methodRef = f.solve(mce);
        ResolvedMethodDeclaration methodDecl = methodRef.getCorrespondingDeclaration();
        return methodDecl.getQualifiedSignature();
    }

    public static String resolveFieldDeclaration(FieldDeclaration fd) {
        String resolvedName = "";
        TypeSolver typeSolver = new CombinedTypeSolver(
            new ReflectionTypeSolver(),
            new JavaParserTypeSolver(DirectoryRootTracker.rootDir));

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
