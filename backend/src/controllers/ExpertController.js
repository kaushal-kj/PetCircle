const ExpertModel = require("../models/ExpertModel");
const UserModel = require("../models/UserModel");

// Get All Experts
const getAllExperts = async (req, res) => {
  try {
    const experts = await ExpertModel.find().populate(
      "user",
      "fullName username email profilePic"
    );
    res
      .status(200)
      .json({ message: "Experts fetched successfully", data: experts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching experts", error });
  }
};

// Get Expert by ID
const getExpertById = async (req, res) => {
  try {
    const expert = await ExpertModel.findById(req.params.id)
      .populate("user", "fullName username email profilePic") // Populate user details
      .populate("consultations.petOwner", "fullName email"); // Populate pet owner details

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res
      .status(200)
      .json({ message: "Expert fetched successfully", data: expert });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expert", error });
  }
};

//get expert consultation
const getExpertConsultations = async (req, res) => {
  try {
    const expert = await ExpertModel.findOne({ user: req.params.id }).populate(
      "consultations.petOwner",
      "fullName email"
    );

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res
      .status(200)
      .json({ message: "Consultations fetched", data: expert.consultations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching consultations", error });
  }
};

// Request a Consultation
const requestConsultation = async (req, res) => {
  try {
    const { expertId, petOwnerId, petDetails, issue } = req.body;

    // Check if pet owner exists
    const petOwner = await UserModel.findById(petOwnerId);
    if (!petOwner)
      return res.status(404).json({ message: "Pet owner not found" });

    const expert = await ExpertModel.findById(expertId);
    if (!expert) return res.status(404).json({ message: "Expert not found" });

    // Add consultation request
    expert.consultations.push({ petOwner: petOwnerId, petDetails, issue });
    await expert.save();

    res.status(201).json({ message: "Consultation requested successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error requesting consultation", error });
  }
};

// Accept or Decline a Consultation
const respondToConsultation = async (req, res) => {
  try {
    const { consultationId, status, appointmentDate } = req.body;

    const updatedExpert = await ExpertModel.findOneAndUpdate(
      { "consultations._id": consultationId },
      {
        $set: {
          "consultations.$.status": status,
          ...(status === "Accepted" && {
            "consultations.$.appointmentDate": appointmentDate,
          }),
        },
      },
      { new: true }
    );

    if (!updatedExpert)
      return res.status(404).json({ message: "Consultation not found" });

    res
      .status(200)
      .json({ message: `Consultation ${status.toLowerCase()} successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error responding to consultation", error });
  }
};

//delete declined consultation
const deleteConsultation = async (req, res) => {
  try {
    const { expertId, consultationId } = req.params;

    // Find the expert
    const expert = await ExpertModel.findById(expertId);
    if (!expert) return res.status(404).json({ message: "Expert not found" });

    // Find the consultation inside the expert's consultations array
    const consultationIndex = expert.consultations.findIndex(
      (c) => c._id.toString() === consultationId
    );

    if (consultationIndex === -1) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // Remove the consultation from the array
    expert.consultations.splice(consultationIndex, 1);
    await expert.save();

    res.status(200).json({ message: "Consultation deleted successfully" });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({ message: "Error deleting consultation", error });
  }
};

module.exports = {
  getAllExperts,
  getExpertById,
  getExpertConsultations,
  requestConsultation,
  respondToConsultation,
  deleteConsultation,
};
