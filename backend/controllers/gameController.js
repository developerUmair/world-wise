const Score = require('../models/Score');

exports.saveScore = async (req, res) => {
  const { currentScore } = req.body;
  const userId = req.user.id; 

  try {
    let score = await Score.findOne({ user: userId });
    if (!score) {
      score = new Score({ user: userId, currentScore, highScore: currentScore });
    } else {
      score.currentScore = currentScore;
      if (currentScore > score.highScore) {
        score.highScore = currentScore;
      }
    }
    await score.save();
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getScore = async (req, res) => {
  const userId = req.user.id; 
  try {
    const score = await Score.findOne({ user: userId });
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
