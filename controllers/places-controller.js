const HttpError = require("../models/http-error");
const { v1: uuidv1 } = require("uuid");
const { validationResult } = require("express-validator");

// Dummy data for places
let DUMMY_PLACES = [
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
  {
    id: "p2",
    title: "Empire state building",
    description: "One of the most famous skys in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 35th St, New Your NY 10001",
    creator: "u1",
  },
  {
    id: "p3",
    title: "Empire state building",
    description: "One of the most famous skys in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 35th St, New Your NY 10001",
    creator: "u2",
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

const getPlacesByUsersId = (req, res, next) => {
  // Get userId from url -> params.uid
  const userId = req.params.uid;
  // Find place with find() method and return place
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  // Handling errors
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  // Send with response found place by userId
  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv1(), // Added id
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ createdPlace });
};

const updatePlaceById = (req, res, next) => {
  // Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  // Getting title and description from inputs body
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find place for that id.", 401);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUsersId = getPlacesByUsersId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
