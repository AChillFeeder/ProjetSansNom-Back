const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.put("/:id", usersController.updateUser);

router.get("/", usersController.getAllUsers);
router.get("/currentUser", usersController.getCurrentUser);
router.get("/:id", usersController.getUserById);

module.exports = router;
