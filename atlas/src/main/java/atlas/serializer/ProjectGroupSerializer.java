package atlas.serializer;

import atlas.groups.IReferencer;
import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import atlas.groups.FileGroup;
import atlas.groups.ProjectGroup;

/**
 *  Extending the standard serializer from Jackson serializes a ProjectGroup to a JSON in a way that can be read by the front-end TS
 */
public class ProjectGroupSerializer extends StdSerializer<ProjectGroup> {

    private static final long serialVersionUID = 480221022747289900L;

    public ProjectGroupSerializer() {
        this(null);
    }

    /**
     * Constructor that takes in an initialized ProjectGroup.
     *
     * @param projectGroup The ProjectGroup to be serialized?
     */
    public ProjectGroupSerializer(Class<ProjectGroup> projectGroup) {
        super(projectGroup);
    }

    /**
     * Serializes the provided ProjectGroup into a format:
     *
     * {
     * "fileBoxes": [
     *   "fileBox1Name": {
     *    "pathname": "",
     *    "source": "",
     *   }
     *   "fileBox2Name": {
     *    ...
     *    }
     *   ... (more fileBox objects)
     *
     *  ]
     *  "arrows": [
     *   {
     *     "from": {
     *       "path": "path/to/file1",
     *       "lineStart": 1,
     *       "lineEnd": 1, (exclusive)
     *       "columnStart": 0,
     *       "columnEnd:" 50
     *     },
     *     "to": {
     *       "path": "path/to/file2",
     *       "lineStart": 1,
     *       "lineEnd": 1, (exclusive)
     *       "columnStart": 0,
     *       "columnEnd:" 50
     *     }
     *   }
     *   {
     *   ... (more arrow objects)
     *   }
     *  ]
     * }
     *
     * @param projectGroup The fully initialized ProjectGroup to be creating the JSON from.
     */
    @Override
    public void serialize(ProjectGroup projectGroup, JsonGenerator jsonGenerator, SerializerProvider serializer) {
        try {
            jsonGenerator.writeStartObject();
            this.writeFileBoxArray(jsonGenerator);
            this.writeArrowArray(jsonGenerator);
            jsonGenerator.writeEndObject();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Serializes the JSON data for each FileBox present in the ProjectGroup
     *
     * @param jsonGenerator The Jackson object that serializes the ProjectGroup
     * @throws IOException If the JsonGenerator isn't able to properly create the JSON object
     */
    private void writeFileBoxArray(JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeArrayFieldStart("fileBoxes");
        for (FileGroup fileGroup : ProjectGroup.fileGroups) {
            jsonGenerator.writeStartObject(fileGroup.getPackage());
            jsonGenerator.writeStringField("pathName", fileGroup.getPackage());
            jsonGenerator.writeStringField("source", fileGroup.getSource());
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();
    }

    /**
     * Serializes the JOSN data for each external method call expression in the Java Project. This is using the
     * master list of expressions that was updated as the ProjectGroup was initialized
     *
     * @param jsonGenerator The Jackson object that serializes the ProjectGroup
     * @throws IOException If the JsonGenerator isn't able to properly create the JSON object
     */
    private void writeArrowArray(JsonGenerator jsonGenerator) throws IOException {
        jsonGenerator.writeArrayFieldStart("arrows");
        for (IReferencer expressionGroup : ProjectGroup.referenceGroups) {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeObjectFieldStart("from");
            jsonGenerator.writeStringField("path", expressionGroup.getPointsFrom().getPath());
            jsonGenerator.writeNumberField("lineStart", expressionGroup.getPointsFrom().getStartLine());
            jsonGenerator.writeNumberField("lineEnd", expressionGroup.getPointsFrom().getEndLine());
            jsonGenerator.writeNumberField("columnStart", expressionGroup.getPointsFrom().getStartCol());
            jsonGenerator.writeNumberField("columnEnd", expressionGroup.getPointsFrom().getEndCol());
            jsonGenerator.writeEndObject();

            jsonGenerator.writeObjectFieldStart("to");
            jsonGenerator.writeStringField("path", expressionGroup.getPointsTo().getPath());
            jsonGenerator.writeNumberField("lineStart", expressionGroup.getPointsTo().getStartLine());
            jsonGenerator.writeNumberField("lineEnd", expressionGroup.getPointsTo().getEndLine());
            jsonGenerator.writeNumberField("columnStart", expressionGroup.getPointsTo().getStartCol());
            jsonGenerator.writeNumberField("columnEnd", expressionGroup.getPointsTo().getEndCol());
            jsonGenerator.writeEndObject();
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndArray();
    }
}
