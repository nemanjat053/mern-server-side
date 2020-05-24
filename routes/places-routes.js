const express = require("express");
const placesControllers = require("../controllers/places-controller");


const router = express.Router();

// Get
router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlaceByUsersId);

// Post
router.post("/", placesControllers.createPlace);

module.exports = router;
