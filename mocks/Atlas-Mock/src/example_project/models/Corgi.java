package example_project.models;

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

  public Cat alterName() {
    return new Cat(new Person("m", "B", 12, "1234"), "jeff");
  }
}

