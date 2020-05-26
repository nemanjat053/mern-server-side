const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// Creating schema for user
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  // [] Many places
  place: [{ type: mongoose.Types.ObjectId, require: true, ref: "Place" }],
});

// Exporting schema
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
