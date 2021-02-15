package mocks.example_project.src.models;

import java.util.ArrayList;

public class Person {
    public int age;
    public String firstName;
    public String lastName;
    private final String socialSecurity;
    private ArrayList<Person> friends;

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

    public String getSocialSecurity() {
        return this.socialSecurity;
    }

    public ArrayList<Person> getFriends() {
        return this.friends;
    }

    public void addFriend(Person friend) {
        this.friends.add(friend);
    }

}
