// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

// Users
router.get("/users", AdminController.getAllUsers);
router.delete("/user/:id", AdminController.deleteUser);

//Experts
router.get("/experts", AdminController.getAllExperts);
router.patch("/expert/approve/:id", AdminController.approveExpert);
router.patch("/expert/reject/:id", AdminController.rejectExpert);
router.delete("/expert/:id", AdminController.deleteExpert);

// Posts
router.get("/posts", AdminController.getAllPosts);
router.delete("/post/:id", AdminController.deletePost);

// Adoptions
router.get("/adoptions", AdminController.getAllAdoptions);
router.delete("/adoption/:id", AdminController.deleteAdoption);

// Communities
router.get("/communities", AdminController.getAllCommunities);
router.delete("/community/:id", AdminController.deleteCommunity);

router.get("/overview", AdminController.getAdminOverview);

module.exports = router;
