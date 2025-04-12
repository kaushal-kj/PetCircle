// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

// Users
router.get("/users", AdminController.getAllUsers);
router.delete("/user/:id", AdminController.deleteUser);

// Experts
router.get("/experts", AdminController.getAllExperts);
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

module.exports = router;
