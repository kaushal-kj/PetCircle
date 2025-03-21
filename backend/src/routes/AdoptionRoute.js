const express = require("express");
const router = express.Router();
const {
  createAdoptionRequest,
  getAllAdoptions,
  getAdoptionById,
} = require("../controllers/AdoptionController");

router.post("/adoption", createAdoptionRequest);
router.get("/adoptions", getAllAdoptions);
router.get("/adoption/:id", getAdoptionById);

module.exports = router;
