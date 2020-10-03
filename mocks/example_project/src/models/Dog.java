package mocks.example_project.src.models;

import java.util.Objects;

public class Dog {
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

    public String getBreed() {
        return this.breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Dog)) {
            return false;
        }
        Dog dog = (Dog) o;
        return Objects.equals(owner, dog.owner) && Objects.equals(name, dog.name) && Objects.equals(breed, dog.breed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(owner, name, breed);
    }

    @Override
    public String toString() {
        return "{" + " owner='" + getOwner() + "'" + ", name='" + getName() + "'" + ", breed='" + getBreed() + "'"
                + "}";
    }

}
