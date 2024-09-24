const express = require("express");
const router = express.Router();
const QuarterlyLeaderboardController = require('../controllers/quarterly-leaderboard-controller');

router.get('/', async (req, res) => {
  const ctrl = new QuarterlyLeaderboardController();
  try {
    const filter = req.query.txtQtrId || '*';
    res.status(200).render("quarterly-leaderboard", await ctrl.getQuarterlyLeaderboardView(filter));
  } catch (err) {
    console.log('bad quarter id',err);
    res.status(400).send(`<h1>The Quarter you selected did not return any results. ${err}</h1>`);
  }
});

module.exports = router;