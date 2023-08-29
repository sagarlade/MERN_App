const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  url: String,
  timestamp: Number,
});

const recording = mongoose.model('Recording', recordingSchema);

module.exports=recording;
