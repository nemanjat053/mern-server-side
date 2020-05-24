const HttpError = require("../models/http-error");
const { v1: uuidv1 } = require("uuid");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "User 1",
    email: "test@test.com",
    password: "testtest",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ message: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exist.", 402);
  }
  const createdUser = {
    id: uuidv1(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ message: "User created.", createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify user.", 401);
  }

  res.json({ message: "Loged in." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
