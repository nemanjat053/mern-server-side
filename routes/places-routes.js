const express = require("express");
const placesControllers = require("../controllers/places-controller");

const router = express.Router();

// Get
router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlacesByUsersId);

// Post
router.post("/", placesControllers.createPlace);

// Update
router.patch("/:pid", placesControllers.updatePlaceById);

// Delete
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
