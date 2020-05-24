const express = require("express");

const router = express.Router();

// Dummy data for places
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state building",
    description: "One of the most famous skys in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 35th St, New Your NY 10001",
    creator: "u1",
  },
];

// Search place with place id
router.get("/:pid", (req, res, next) => {
  // Get placeId from url -> params.pid
  const placeId = req.params.pid;
  // Find place with find() method and return place
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  // Handling errors
  if (!place) {
    const error = new Error("Could not find a place for provided id.");
    error.code = 404;
    throw error;
  }

  // Send with response found place
  res.json({ place });
});

// Search place with userId
router.get("/user/:uid", (req, res, next) => {
  // Get userId from url -> params.uid
  const userId = req.params.uid;
  // Find place with find() method and return place
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  // Handling errors
  if (!place) {
    const error = new Error("Could not find a place for provided user id.");
    error.code = 404;
    return next(error);
  }

  // Send with response found place by userId
  res.json({ place });
});

module.exports = router;
