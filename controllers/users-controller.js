const HttpError = require("../models/http-error");
const { v1: uuidv1 } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "User 1",
    email: "test@test.com",
    password: "testtest",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Could not find any users.", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: tru })) });
};

// Function for signup
const signup = async (req, res, next) => {
  // Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Could not find that user", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exist already, please log in instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not sing up.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "User created.",
    user: createdUser.toObject({ getters: true }),
  });
};

// Function for log in
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.find({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed.", 500);
    return next(error);
  }

  if (!user || user.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.status(200).json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
