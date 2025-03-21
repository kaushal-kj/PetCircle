const routes = require("express").Router();
const userController = require("../controllers/UserController");

routes.post("/user/signup", userController.signup);
routes.post("/user/login", userController.loginUser);
routes.get("/users", userController.getAllUsers);
routes.get("/user/:id", userController.getUserById);
routes.put("/user/update/:id", userController.updateProfile);

module.exports = routes;
