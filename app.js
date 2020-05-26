const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

// Getting routes from 'Routes' folder
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // Methods to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
// Definition routes
// Using middleware
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// Middleware for unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("Could not found this route.", 404);
  throw error;
});

// Middleware for error handling
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  // If there is error message return it, else return 'An unknown error occurred'.
  res.json({ message: error.message || "An unknown error occurred!" });
});

// Server starts on PORT :5000 (localhost:5000)
// Connecting to mongoose server
mongoose
  .connect("mongodb://localhost:27017/mernApp", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log("Error with starting server : | " + err);
  });

mongoose.set("useCreateIndex", true);
