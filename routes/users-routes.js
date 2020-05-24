const express = require("express");
const usersController = require("../controllers/users-controller");
const router = express.Router();
const { check } = require("express-validator");

// Get
router.get("/", usersController.getUsers);

// Post
router.post(
  "/signup",
  [
    check("name").not().isEmpty,
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

// Update
router.post("/login", usersController.login);

module.exports = router;
