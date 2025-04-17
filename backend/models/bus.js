const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busNumber: Number,
  from: String,
  to: String,
  via: [String], // All stops or locations this bus goes through
  distance: Number
});

module.exports = mongoose.model("bus", BusSchema);
