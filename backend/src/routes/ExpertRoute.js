const express = require("express");
const router = express.Router();
const {
  getAllExperts,
  getExpertById,
  getExpertConsultations,
  requestConsultation,
  respondToConsultation,
  deleteConsultation,
} = require("../controllers/ExpertController");

router.get("/experts", getAllExperts);
router.get("/expert/:id", getExpertById);
router.get("/expert/:id/consultations", getExpertConsultations);

// New routes
router.post("/consultation/request", requestConsultation);
router.post("/consultation/respond", respondToConsultation);
router.delete("/consultation/:expertId/:consultationId", deleteConsultation);

module.exports = router;
