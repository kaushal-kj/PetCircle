const express = require("express");
const router = express.Router();
const {
  createContest,
  getAllContests,
  getContestById,
} = require("../controllers/ContestController");

router.post("/contest", createContest);
router.get("/contests", getAllContests);
router.get("/contest/:id", getContestById);

module.exports = router;
