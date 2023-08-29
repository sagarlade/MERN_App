const router = require("express").Router();
const Recording = require('../modules/Recording');

// Save a new recording
router.post('/', async (req, res) => {
  const { url, timestamp } = req.body;
  try {
    const newRecording = new Recording({ url, timestamp });
    await newRecording.save();
    res.status(201).json(newRecording);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save recording' });
  }
});

// Get all recordings
router.get('/', async (req, res) => {
  try {
    const recordings = await Recording.find().sort({ timestamp: -1 });
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recordings' });
  }
});

module.exports = router;
