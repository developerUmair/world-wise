const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentScore: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  }
});

const Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
