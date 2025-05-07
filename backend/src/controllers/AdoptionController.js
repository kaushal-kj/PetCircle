const Adoption = require("../models/AdoptionModel");
const Pet = require("../models/PetModel");

const createAdoption = async (req, res) => {
  try {
    const { petId, postedBy, contactInfo, message } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Mark pet as available for adoption
    pet.isAvailableForAdoption = true;
    await pet.save();

    const adoption = new Adoption({
      pet: petId,
      postedBy,
      contactInfo,
      message,
    });

    await adoption.save();
    res.status(201).json({ message: "Adoption created", data: adoption });
  } catch (error) {
    res.status(500).json({ message: "Error creating adoption", error });
  }
};

const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate("pet")
      .populate("postedBy", "fullName username phoneNumber");

    res.status(200).json({ data: adoptions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoptions", error });
  }
};

const deleteAdoption = async (req, res) => {
  try {
    const { id } = req.params;

    const adoption = await Adoption.findById(id);
    if (!adoption) return res.status(404).json({ message: "Not found" });

    // Update pet status
    const pet = await Pet.findById(adoption.pet);
    if (pet) {
      pet.isAvailableForAdoption = false;
      await pet.save();
    }

    await Adoption.findByIdAndDelete(id);
    res.status(200).json({ message: "Adoption deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting adoption", error });
  }
};

module.exports = {
  createAdoption,
  getAllAdoptions,
  deleteAdoption,
};
