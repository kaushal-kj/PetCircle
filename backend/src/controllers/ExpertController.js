const ExpertModel = require("../models/ExpertModel");
const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Store uploaded files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage }).single("profilePic");

// Create Expert Profile
const createExpert = async (req, res) => {
  try {
    const expert = new ExpertModel(req.body);
    await expert.save();
    res
      .status(201)
      .json({ message: "Expert created successfully", data: expert });
  } catch (error) {
    res.status(500).json({ message: "Error creating expert", error });
  }
};

// Get All Experts
const getAllExperts = async (req, res) => {
  try {
    const experts = await ExpertModel.find().populate("user", "username email");
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
    const expert = await ExpertModel.findById(req.params.id).populate(
      "user",
      "username email"
    );
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

// Request a Consultation
const requestConsultation = async (req, res) => {
  try {
    const { expertId, petOwnerId, petDetails, issue } = req.body;

    const expert = await ExpertModel.findById(expertId);
    if (!expert) return res.status(404).json({ message: "Expert not found" });

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
    const { expertId, consultationId, status, appointmentDate } = req.body;

    const expert = await ExpertModel.findById(expertId);
    if (!expert) return res.status(404).json({ message: "Expert not found" });

    const consultation = expert.consultations.id(consultationId);
    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    consultation.status = status;
    if (status === "Accepted") {
      consultation.appointmentDate = appointmentDate;
    }

    await expert.save();
    res
      .status(200)
      .json({ message: `Consultation ${status.toLowerCase()} successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error responding to consultation", error });
  }
};

module.exports = {
  createExpert,
  getAllExperts,
  getExpertById,
  requestConsultation,
  respondToConsultation,
};
