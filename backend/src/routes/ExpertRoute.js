const express = require("express");
const router = express.Router();
const {
  getAllExperts,
  getExpertById,
} = require("../controllers/ExpertController");

router.get("/experts", getAllExperts);
router.get("/expert/:id", getExpertById);


module.exports = router;
