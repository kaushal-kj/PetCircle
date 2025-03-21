const express = require("express");
const router = express.Router();
const {
  createExpert,
  getAllExperts,
  getExpertById,
} = require("../controllers/ExpertController");

router.post("/expert", createExpert);
router.get("/experts", getAllExperts);
router.get("/expert/:id", getExpertById);

module.exports = router;
