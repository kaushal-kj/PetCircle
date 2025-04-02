const routes = require("express").Router();
const userController = require("../controllers/UserController");

routes.post("/user/signup", userController.signup);
routes.post("/user/login", userController.loginUser);
routes.get("/users", userController.getAllUsers);
routes.get("/user/:id", userController.getUserById);
routes.put("/user/update/:id", userController.updateProfile);
routes.post("/user/forgotpassword", userController.forgotPassword);
routes.post("/user/resetpassword", userController.resetpassword);

//follow and unfollow routes
routes.post("/user/follow", userController.followUser);
routes.post("/user/unfollow", userController.unfollowUser);

//get followers and following
routes.get("/user/:id/followers", userController.getFollowers);
routes.get("/user/:id/following", userController.getFollowing);

module.exports = routes;
