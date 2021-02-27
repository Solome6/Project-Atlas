This is the main directory for the Front-End of Project Atlas which specializes in visualizing the JSON string created after parsing the Java code.

### Overview ###
When the extension first runs the user is prompted to choose the `source` directory of the project they want visualized. Using that path the back-end `jar` is executed to create the JSON string.

With the JSON string, it's parsed to identify all of the Files and Expression Arrows that have to be visualized and using HTML injection 