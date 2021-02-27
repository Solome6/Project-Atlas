This directory is handles the back-end aspect of Project Atlas which parses Java code looking for external method call expressions or anything that references some external file. 

### Overview ###
The specified Java project is parsed creating a tree like structure of which the JSON is generated from

```
                  Project Group
                       |
                       |
                Directory Group
                       |
                       |
                   File Group
                       |
                ---------------
                |             |
                Field Group   Function Group
                                      |
                                Expression Group
```

Each Java File is pares using the [JavaParser Library](http://javaparser.org/) and once all external references are logged and saved a JSON file is generated using Jackson which is then used by the front-end.