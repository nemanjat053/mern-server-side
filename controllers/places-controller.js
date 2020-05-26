const HttpError = require("../models/http-error");
const { v1: uuidv1 } = require("uuid");
const { validationResult } = require("express-validator");

const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  // Mongoose function findbyid()
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  // Handling errors
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  // Send with response found place
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUsersId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not find places for specific users.",
      500
    );
    return next(error);
  }

  // Handling errors
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  // Send with response found place by userId
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://www.nycgo.com/images/venues/1097/wall-street-photo-tagger-yancey-iv-nyc-and-company-02-2__x_large.jpg",
    creator,
  });

  let user;
  try {
    await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 400);
    return next(error);
  }

  // Try/Catch block fro adding data
  try {
    // Start new session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Create place
    await createdPlace.save({ session: sess });
    // Push created place in user places
    user.places.push(createdPlace);
    // Save modified user
    await user.save({ session: sess });
    // Commit changes in session
    await sess.commitTransaction();
    // Going to error handling
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again" + err,
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  // Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  // Getting title and description from inputs body
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// Delete
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Place does not exist", 404);
    return next(error);
  }

  try {
    // Creating and starting session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Removing place
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    // Save changes
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    // Error handling
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUsersId = getPlacesByUsersId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
