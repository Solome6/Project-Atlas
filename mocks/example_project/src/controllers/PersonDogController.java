package mocks.example_project.src.controllers;

import java.util.ArrayList;

import mocks.example_project.src.models.Dog;
import mocks.example_project.src.models.Pet;
import mocks.example_project.src.views.DogView;
import mocks.example_project.src.views.PetRelationshipView;

public class PersonDogController {

    public ArrayList<Pet> pets;
    public PetRelationshipView view;

    public PersonDogController(ArrayList<Pet> pets, PetRelationshipView view) {
        this.pets = pets;
        this.view = view;
    }

    public void run() {
        for (Pet pet : this.pets) {
            if (pet instanceof Dog) {
                DogView dv = new DogView(pet.getName());
                this.view.drawDog(dv);
            }
        }
    }
}
