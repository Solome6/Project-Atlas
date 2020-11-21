package atlas;

import java.io.File;
import java.io.FileWriter;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

import atlas.groups.ProjectGroup;
import atlas.serializer.ProjectGroupSerializer;
import java.util.Arrays;

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

        args = new String[]{"D:\\Programming\\Project-Atlas\\", "D:\\Programming\\Project-Atlas\\mocks\\example_project\\src"};
        if (args != null && args.length > 0) {
            try {
                String projectRoot = args[0];
                String projectPath = args[1];
                ProjectGroup projectGroup = new ProjectGroup(projectRoot, projectPath);
                FileWriter writer = new FileWriter(new File("atlas.json"));
                writer.write(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(projectGroup));
                writer.close();
                System.out.println("--------------------------------------------------------------!");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
