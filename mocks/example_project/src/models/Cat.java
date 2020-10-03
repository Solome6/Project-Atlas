package mocks.example_project.src.models;

public class Cat implements Pet {
    public Person owner;
    public String name;

    public Cat(Person owner, String name) {
        this.owner = owner;
        this.name = name;
    }

    public Person getOwner() {
        return this.owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
