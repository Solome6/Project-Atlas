package atlas;

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
      args = new String[]{"c:\\Programming\\Atlas-Mock\\src"};
        if (args != null && args.length == 1) {
            try {
                String projectPath = args[0];

                ProjectGroup projectGroup = new ProjectGroup(projectPath);
                System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(projectGroup));
            } catch (Exception e) {
                System.out.println("Exception:");
                e.printStackTrace();
                System.out.println(e.getMessage());
                e.getCause();
            }
        }
    }
}
