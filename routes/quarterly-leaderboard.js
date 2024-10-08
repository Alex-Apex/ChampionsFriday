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

/**
 * 
 */
router.get("/quarter-badges", async (req, res) => {
  const ctrl = new QuarterlyLeaderboardController();
  try{
    res.status(200).render("partials/badges-checkbox-list",await ctrl.getRemainingQuarterBadges(req.query));
  } catch (err) {
    console.error(`Failed to get the available badges for the quarter and username provided`, err);
    res.status(400).send(`Failed to get the available badges for the quarter and username provided ${err}`);
  }
});

// Handles the event of awarding a new badge
router.post("/awardbadge", async (req, res) => {
  console.log('Inside /awardBadge');
  const ctrl = new QuarterlyLeaderboardController();
  try{
    res.status(200).render("partials/quarter-leaderboard-list", await ctrl.awardBadges(req.body));
  } catch(err) {
    console.error("Error while attempting to award badges:", err);
    res.status(500).send("Error while attempting to award badges"); // TODO: Handle errors more robustly
    //TODO show error toast on client
    return;
  }
});

module.exports = router;