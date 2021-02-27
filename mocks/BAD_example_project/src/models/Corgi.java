package mocks.example_project.src.models;

public class Corgi extends Dog {

    public Corgi() {
        super(null, "CorgSmith", "Corgi");
    }

    @Override
    public String getName() {
        return "I'm " + super.getName();
    }

    @Override
    public String bark() {
        return "Woof";
    }

}
