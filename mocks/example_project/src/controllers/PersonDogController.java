package mocks.example_project.src.controllers;

import java.util.ArrayList;

import mocks.example_project.src.models.Corgi;
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
            if (pet instanceof Corgi) {
                Corgi corgi = (Corgi) pet;
                Dog dog = corgi;

                System.out.println(corgi.bark());
                System.out.println(dog.bark());
                System.out.println(dog.getName());

                DogView dv1 = new DogView(pet.getName());
                DogView dv2 = new DogView(corgi.getName());
                this.view.drawDog(dv1);
                this.view.drawDog(dv2);
            }
        }
    }
}
