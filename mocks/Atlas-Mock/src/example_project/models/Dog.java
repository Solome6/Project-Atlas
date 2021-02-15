package example_project.models;

public abstract class Dog implements Pet {
  public Person owner;
  public String name;
  public String breed;

  public Dog(Person owner, String name, String breed) {
    this.owner = owner;
    this.name = name;
    this.breed = breed;
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

  public abstract String bark();

}
