const express = require("express");
const router = express.Router();
const {
  createExpert,
  getAllExperts,
  getExpertById,
  requestConsultation,
  respondToConsultation,
} = require("../controllers/ExpertController");

router.post("/expert", createExpert);
router.get("/experts", getAllExperts);
router.get("/expert/:id", getExpertById);

// New routes
router.post("/consultation/request", requestConsultation);
router.post("/consultation/respond", respondToConsultation);

module.exports = router;
