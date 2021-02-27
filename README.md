<img src="./atlas-logo.png" align="left" height="100">

**Project Atlas** is a static analysis and visualization extension for Java implemented in TypeScript and Java
using
[JavaParser](http://javaparser.org/). The goal of Project Atlas is to create a visualization of code code implementation to better understand 
 
---

## Why Project Atlas?

At the end of the day software developers and engineers spend the majority of their time reading code, and it's imporant to have systems in place to understand how our code functions especially as projects grow in size, scope, and complexity. 

## Getting started

Since Project Atlas will be a VSCode extension it can be easily installed through the VSCode Marketplace

When it comes to setting up the project locally, the project is broken up into two parts. The Front-End and Back-End respectively

First, clone this project onto your machine:
```
$ git clone https://github.com/Solome6/Project-Atlas.git
$ cd Project-Atlas/
```

Next, to access the backend do:
```
$ cd ./atlas/                  
```

The back-end uses [Maven](https://maven.apache.org/what-is-maven.html) for compilation and can be run using
```
$ mvn clean install exec:java
```

Meanwhile, the Front-End can be accessed and set-up by doing:
```
$ cd /Project-Atlas/atlas-extension/project-atlas/
$ npm install
```

#### Running Project Atlas

**Running the Extension**
To run the Project Atlas extension simply choose the `Project Atlas: Open Project` command after doing `ctrl+shift+p`. Then you will be prompted to choose the `src` driectory of your project. This is used for proper type solving using JavaParser

**Local Extension Development**
Once both the Front-End and Back-End have the neccessary dependencies installed and the `/atlas-extension/project-atlas` folder is opened in VSCode you can open a debugger window using `CRTL+FN5` for Windows or `CMD+FN5` for Macs and open the VSCode debugger window to locally run and test the extension.


#### How ####

When the command is executed, Project Atlas parses Java code specifically looking for various *Method Call Expressions* or anything else that may have a reference to some external file. After the code has been parsed and all neccessary expressions have been identified a JSON string is created outlining all the files, directories, and expressions

The JSON format looks like this:
```
{
    "directories": {
        {
            "pathName": "",
            "parent": ""
        }  
      // and so on...
    },
    "fileBoxes": {
        {
            "pathName": "",
            "source": "",
            "parent": ""
        },
        // and so on...
    },
    "arrows": [
        {
            "from": {
                "path": "path/to/file1",
                "lineStart": 1,
                "lineEnd": 2, //exclusive
                "columnStart": 0,
                "columnEnd": 50
            },
            "to": {
                "path": "path/to/file2",
                "lineStart": 5,
                "lineEnd": 6,
                "columnStart": 0,
                "columnEnd": 40
            }
        },
        // and so on...
    ]
}
```
This JSON structure is then passed to the Front-End which then creates the neccessary visualization.