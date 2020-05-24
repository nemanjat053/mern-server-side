const HttpError = require("../models/http-error");
const { v1: uuidv1 } = require('uuid');

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

const getPlaceById = (req, res, next) => {
  // Get placeId from url -> params.pid
  const placeId = req.params.pid;
  // Find place with find() method and return place
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  // Handling errors
  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  // Send with response found place
  res.json({ place });
};

const getPlaceByUsersId = (req, res, next) => {
  // Get userId from url -> params.uid
  const userId = req.params.uid;
  // Find place with find() method and return place
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  // Handling errors
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  // Send with response found place by userId
  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv1(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ createdPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUsersId = getPlaceByUsersId;
exports.createPlace = createPlace;
