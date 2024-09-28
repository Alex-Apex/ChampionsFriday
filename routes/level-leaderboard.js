const express = require("express");
const router = express.Router();
const LevelLeaderboardController = require('../controllers/level-leaderboard-controller');

router.get("/", async (req, res) => {
  const ctrl = new LevelLeaderboardController();
  
  try {
    const filter = req.query.txtQtrId || '*';    
    res.status(200).render("level-leaderboard", await ctrl.getLevelsLeaderboardView(filter));
  } catch (err) {
    console.log('leaderboard: bad quarter id',err);
    res.status(400).send('<h1>The Quarter you selected did not return any results</h1>');
  }
});

module.exports = router;
