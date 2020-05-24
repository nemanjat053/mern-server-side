const express = require("express");
const bodyParser = require("body-parser");

// Getting routes from 'Routes' folder
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());
// Definition routes
// Using middleware
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

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
app.listen(5000);

// Getting place by user id
