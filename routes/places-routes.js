const express = require("express");
const placesControllers = require("../controllers/places-controller");
const { check } = require("express-validator");

const router = express.Router();

// Get
router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlacesByUsersId);

// Post
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

// Update
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);

// Delete
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
