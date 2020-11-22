package atlas;

import java.io.File;
import java.io.FileWriter;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import atlas.groups.ProjectGroup;
import atlas.serializer.ProjectGroupSerializer;

/**
 * Hello world!
 */
public final class App {
    private App() {
    }

    /**
     * Says hello to the world.
     *
     * @param args The arguments of the program.
     */
    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule("ProjectGroupSerializer", new Version(1, 0, 0, null, null, null));
        module.addSerializer(ProjectGroup.class, new ProjectGroupSerializer());
        mapper.registerModule(module);

<<<<<<< HEAD
        // args = new String[]{"D:\\Programming\\Project-Atlas\\",
        // "D:\\Programming\\Project-Atlas\\mocks\\example_project\\src"};
=======
        args = new String[]{"D:\\Programming\\Project-Atlas\\", "D:\\Programming\\Project-Atlas\\mocks\\example_project\\src"};
>>>>>>> 271bfa8aa8c815e7fa26b3d4b3c6841ac772857e
        if (args != null && args.length > 0) {
            try {
                String projectRoot;
                String projectPath;
                if (args.length == 1) {
                    String arg = args[0];
                    args = arg.split(" ");
                }
                projectRoot = args[0];
                projectPath = args[1];

                ProjectGroup projectGroup = new ProjectGroup(projectRoot, projectPath);
                File f = new File("atlas.json");
                f.setWritable(true);
                f.setReadable(true);
                FileWriter writer = new FileWriter(f);
                writer.write(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(projectGroup));
                writer.close();
                System.out.println("--------------------------------------------------------------!");
            } catch (Exception e) {
                System.out.println("Exception:");
                e.printStackTrace();
                System.out.println(e.getMessage());
                System.out.println(e.getCause());
            }
        }
    }
}
