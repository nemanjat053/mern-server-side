const express = require("express");
const usersController = require("../controllers/users-controller");
const router = express.Router();

// Get
router.get("/", usersController.getUsers);

// Post
router.post("/signup", usersController.signup);

// Update
router.post("/login", usersController.login);

module.exports = router;
