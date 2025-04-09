const express = require("express");
const {
  createAdoption,
  getAllAdoptions,
  deleteAdoption,
} = require("../controllers/AdoptionController");

const router = express.Router();

router.post("/adoption/create", createAdoption); // Create adoption
router.get("/adoptions", getAllAdoptions); // Get all
router.delete("/adoption/:id", deleteAdoption); // Delete by ID

module.exports = router;
