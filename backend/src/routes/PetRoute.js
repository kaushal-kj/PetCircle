const express = require("express");
const routes = express.Router();
const PetController = require("../controllers/PetController");

routes.post("/pet", PetController.createPet);
routes.get("/pet/:id", PetController.getPetById);
routes.get("/pets", PetController.getAllPets);
routes.put("/pet/:id", PetController.updatePet);
routes.delete("/pet/:id", PetController.deletePet);
routes.post("/addPetWithFile", PetController.addPetWithFile);

module.exports = routes;
