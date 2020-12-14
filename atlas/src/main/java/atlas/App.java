package atlas;

import java.io.File;
import java.io.FileWriter;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import atlas.groups.ProjectGroup;
import atlas.serializer.ProjectGroupSerializer;

/**
 * Main class run to initialize the representation of a Java Project to be visualized in the Atlas extension.
 */
public final class App {

    /**
     * Provided with a directory of Java files, initializes a ProjectGroup
     *  generates a JSON of the various expression calls from the project 
     *
     * @param args The arguments of the program.
     */
    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule("ProjectGroupSerializer", new Version(1, 0, 0, null, null, null));
        module.addSerializer(ProjectGroup.class, new ProjectGroupSerializer());
        mapper.registerModule(module);

        args = new String[]{"D:\\Programming\\Project-Atlas\\", "D:\\Programming\\Project-Atlas\\mocks\\example_project\\src"};
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
