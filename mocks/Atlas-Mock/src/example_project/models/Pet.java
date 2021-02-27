package example_project.models;

public interface Pet {
  public Person getOwner();

  public void setOwner(Person owner);

  public String getName();

  public void setName(String name);
}

