package atlas.serializer;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import atlas.groups.ExpressionGroup;
import atlas.groups.FileGroup;
import atlas.groups.ProjectGroup;

public class ProjectGroupSerializer extends StdSerializer<ProjectGroup> {

	private static final long serialVersionUID = 480221022747289900L;

	public ProjectGroupSerializer() {
		this(null);
	}

	public ProjectGroupSerializer(Class<ProjectGroup> projectGroup) {
		super(projectGroup);
	}

	@Override
	public void serialize(ProjectGroup projectGroup, JsonGenerator jsonGenerator, SerializerProvider serializer) {
		try {
			jsonGenerator.writeStartObject();
			jsonGenerator.writeArrayFieldStart("fileBoxes");
			jsonGenerator.writeStartArray();
			for(FileGroup fileGroup : ProjectGroup.fileGroups) {
				jsonGenerator.writeStartObject(fileGroup.getPath());
				jsonGenerator.writeStringField("pathName", fileGroup.getPath());
				jsonGenerator.writeStringField("source", fileGroup.getSource());
				jsonGenerator.writeEndObject();
			}
			jsonGenerator.writeEndArray();

			jsonGenerator.writeArrayFieldStart("arrows");
			jsonGenerator.writeStartArray();
			for(ExpressionGroup expressionGroup : ProjectGroup.expressionGroups) {
				jsonGenerator.writeStartObject("from");
				jsonGenerator.writeStringField("path", expressionGroup.getPointsFrom().getPath());
				jsonGenerator.writeNumberField("lineStart", expressionGroup.getPointsTo().getStartLine());
				jsonGenerator.writeNumberField("lineEnd", expressionGroup.getPointsTo().getEndLine());
				jsonGenerator.writeNumberField("columnStart", expressionGroup.getPointsTo().getStartCol());
				jsonGenerator.writeNumberField("columnStart", expressionGroup.getPointsTo().getEndCol());
				jsonGenerator.writeEndObject();

				jsonGenerator.writeStartObject("to");
				jsonGenerator.writeStringField("path", expressionGroup.getPointsTo().getPath());
				jsonGenerator.writeNumberField("lineStart", expressionGroup.getPointsFrom().getStartLine());
				jsonGenerator.writeNumberField("lineEnd", expressionGroup.getPointsFrom().getEndLine());
				jsonGenerator.writeNumberField("columnStart", expressionGroup.getPointsFrom().getStartCol());
				jsonGenerator.writeNumberField("columnStart", expressionGroup.getPointsFrom().getEndCol());
				jsonGenerator.writeEndObject();
			}
			jsonGenerator.writeEndArray();
			jsonGenerator.writeEndObject();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}