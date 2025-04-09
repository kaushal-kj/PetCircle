const PetModel = require("../models/PetModel");
const User = require("../models/UserModel"); // Import User model
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const path = require("path");
const multer = require("multer");
const AdoptionModel = require("../models/AdoptionModel");

// Multer Storage Engine
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer Upload Object
const upload = multer({ storage: storage }).single("image");

// ✅ Create Pet and Add to User's `pets` Array
const createPet = async (req, res) => {
  try {
    const { owner } = req.body;

    // Ensure owner exists
    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the pet
    const pet = await PetModel.create(req.body);

    // Add pet ID to user's pets array
    user.pets.push(pet._id);
    await user.save();

    res.status(201).json({ message: "Pet created successfully", data: pet });
  } catch (error) {
    res.status(500).json({ message: "Error creating pet", error });
  }
};

// ✅ Get Pet by ID (With Owner Info)
const getPetById = async (req, res) => {
  try {
    const pet = await PetModel.findById(req.params.id).populate(
      "owner",
      "username email phoneNumber"
    );
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json({ message: "Pet fetched successfully", data: pet });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pet", error });
  }
};

// ✅ Get All Pets (Filter by Owner if Provided)
const getAllPets = async (req, res) => {
  try {
    const { owner } = req.query; // Get owner ID from query params
    const query = owner ? { owner } : {}; // If owner is provided, filter pets
    const pets = await PetModel.find(query).populate("owner", "username email");

    res.status(200).json({ message: "Pets fetched successfully", data: pets });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res
      .status(500)
      .json({ message: "Error fetching pets", error: error.message });
  }
};

// ✅ Update Pet by ID
// const updatePet = async (req, res) => {
//   try {
//     const updatedPet = await PetModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedPet) {
//       return res.status(404).json({ message: "Pet not found" });
//     }
//     res
//       .status(200)
//       .json({ message: "Pet updated successfully", data: updatedPet });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating pet", error });
//   }
// };

const updatePet = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload error", error: err });
    }

    try {
      const petId = req.params.id;
      const updateData = req.body;

      // Handle image file upload if present
      if (req.file) {
        const result = await cloudinaryUtil.uploadFileToCloudinary(req.file);
        updateData.photos = [result.secure_url];
      }

      const updatedPet = await PetModel.findByIdAndUpdate(petId, updateData, {
        new: true,
      });

      if (!updatedPet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      res
        .status(200)
        .json({ message: "Pet updated successfully", data: updatedPet });
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ message: "Error updating pet", error });
    }
  });
};

// ✅ Delete Pet by ID (Remove from User's `pets` Array)
const deletePet = async (req, res) => {
  try {
    const pet = await PetModel.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Remove pet ID from owner's pets array
    await User.findByIdAndUpdate(pet.owner, { $pull: { pets: pet._id } });

    //  Delete related adoption post (if any)
    await AdoptionModel.deleteOne({ pet: pet._id });

    // Delete pet from database
    await PetModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pet", error });
  }
};

// ✅ Add Pet with Cloudinary Image Upload
const addPetWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    try {
      const { owner, name, breed, age, weight, medicalHistory, isRehomed } =
        req.body;

      //changes start
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      if (!owner || !name || !breed || !age) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      //changes end

      // Ensure owner exists
      const user = await User.findById(owner);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file
      );

      // Store pet data in database
      // req.body.photos = [cloudinaryResponse.secure_url];
      // const savedPet = await PetModel.create(req.body);

      const newPet = new PetModel({
        name,
        breed,
        age,
        weight,
        medicalHistory,
        isRehomed,
        owner,
        photos: [cloudinaryResponse.secure_url],
      });

      const savedPet = await newPet.save();

      // Add pet ID to user's pets array
      if (!isRehomed || isRehomed === "false") {
        user.pets.push(savedPet._id);
        await user.save();
      }
      res
        .status(200)
        .json({ message: "Pet saved successfully", data: savedPet });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error saving pet", error: error.message });
    }
  });
};
module.exports = {
  createPet,
  getPetById,
  getAllPets,
  updatePet,
  deletePet,
  addPetWithFile,
};
