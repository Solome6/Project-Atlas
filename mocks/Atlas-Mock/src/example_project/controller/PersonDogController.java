package example_project.controller;

import java.util.ArrayList;

import example_project.models.Corgi;
import example_project.models.Dog;
import example_project.models.Pet;
import example_project.views.DogView;
import example_project.views.PetRelationshipView;

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

        pet.setName(corgi.getName());

        dog.getOwner();

        corgi.getOwner();

        pet.getOwner().getSocialSecurity();

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
