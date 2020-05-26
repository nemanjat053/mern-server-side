const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating schema for prace
const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
  // {} one user
  creator: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
});

// Exporting schema
module.exports = mongoose.model("Place", placeSchema);
