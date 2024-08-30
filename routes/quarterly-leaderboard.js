const express = require("express");
const router = express.Router();
const QuarterlyLeaderboardController = require('../controllers/quarterly-leaderboard');

router.get('/', async (req, res) => {
  const leaderboardCtrl = new QuarterlyLeaderboardController();
  try {
    const filter = req.query.txtQtrId || '*';
    const championsRows = await leaderboardCtrl.getChampionsFridayLeaderboard(filter);
    const champions = leaderboardCtrl.getChampionsLeaderboardFromResult(championsRows);    
    res.render("quarterly-leaderboard", {layout:'main',title:'Champions Friday Quarterly Leaderboard', champions });
    //res.render("partials/leaderboard-cards", { champions });
  } catch (err) {
    console.log('bad quarter id',err);
    res.status(400).send(`<h1>The Quarter you selected did not return any results. ${err}</h1>`);
  }
});

module.exports = router;