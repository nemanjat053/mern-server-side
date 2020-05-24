const express = require("express");
const bodyParser = require("body-parser");

// Getting routes from 'Routes' folder
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const app = express();

// Definition routes
// Using middleware
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// Server starts on PORT :5000 (localhost:5000)
app.listen(5000);

// Getting place by user id
