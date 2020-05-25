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
  creator: { type: String, require: true },
});

// Exporting schema
module.exports = mongoose.model("Place", placeSchema);
