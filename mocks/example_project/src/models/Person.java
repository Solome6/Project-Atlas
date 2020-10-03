package mocks.example_project.src.models;

import java.util.ArrayList;
import java.util.Objects;

public class Person {
    public int age;
    public String firstName;
    public String lastName;
    private final String socialSecurity;
    public ArrayList<Person> friends;

    public Person(String firstName, String lastName, int age, String socialSecurity) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.socialSecurity = socialSecurity;
        this.friends = new ArrayList<>();
    }

    public Person(String firstName, String lastName, int age, String socialSecurity, ArrayList<Person> friends) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.socialSecurity = socialSecurity;
        this.friends = friends;
    }

    public int getAge() {
        return this.age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getSocialSecurity() {
        return this.socialSecurity;
    }

    public ArrayList<Person> getFriends() {
        return this.friends;
    }

    public void addFriend(Person friend) {
        this.friends.add(friend);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Person)) {
            return false;
        }
        Person person = (Person) o;
        return age == person.age && Objects.equals(firstName, person.firstName)
                && Objects.equals(lastName, person.lastName) && Objects.equals(socialSecurity, person.socialSecurity)
                && Objects.equals(friends, person.friends);
    }

    @Override
    public int hashCode() {
        return Objects.hash(age, firstName, lastName, socialSecurity, friends);
    }

    @Override
    public String toString() {
        return "{" + " age='" + getAge() + "'" + ", firstName='" + getFirstName() + "'" + ", lastName='" + getLastName()
                + "'" + ", socialSecurity='" + getSocialSecurity() + "'" + ", friends='" + getFriends() + "'" + "}";
    }

}
