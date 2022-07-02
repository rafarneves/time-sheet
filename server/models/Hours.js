const mongoose = require("mongoose");

const HoursSchema = new mongoose.Schema({
  id: String,
  date: String,
  startHour: String,
  finishHour: String,
});

const Hours = mongoose.model("Hours", HoursSchema);
module.exports = Hours;
