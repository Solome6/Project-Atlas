package mocks.example_project.src.controllers;

import java.util.ArrayList;

import mocks.example_project.src.models.Dog;
import mocks.example_project.src.views.DogView;
import mocks.example_project.src.views.PetRelationshipView;

public class PersonDogController {

    public ArrayList<Dog> dogs;
    public PetRelationshipView view;

    public PersonDogController(ArrayList<Dog> dogs, PetRelationshipView view) {
        this.dogs = dogs;
        this.view = view;
    }

    public void run() {
        for (Dog dog : this.dogs) {
            DogView dv = new DogView(dog.getName());
            this.view.drawDog(dv);
        }
    }
}
