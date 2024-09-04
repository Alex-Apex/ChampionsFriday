const express = require("express");
const router = express.Router();
const qtrLeaderboard = require('../controllers/quarterly-leaderboard');

router.get("/", async (req, res) => {
  const ctrl = new qtrLeaderboard();
  try {
    const filter = req.query.txtQtrId || '*';
    const championsRows = await ctrl.getChampionsFridayLeaderboard(filter);
    const champions = ctrl.getChampionsLeaderboardFromResult(championsRows);
    res.render("partials/leaderboard-cards", { champions });
  } catch (err) {
    console.log('leaderboard: bad quarter id',err);
    res.status(400).send('<h1>The Quarter you selected did not return any results</h1>');
  }
});

/**
 * 
 */
router.get("/quarter-badges", async (req, res) => {
  const ctrl = new qtrLeaderboard();
  const usernameFilter = req.query.txtUsername ? `${req.query.txtUsername}` : '';
  const dateFilter = req.query.txtDateAwarded
    ? `'${req.query.txtDateAwarded}'`
    : `'${new Date().toISOString().split('T')[0]}'`;
  try {
    if (usernameFilter === '') {
      throw new Error('Username is required and cannot be empty');
    }
    const result = await ctrl.getUsernameQuarterBadges(usernameFilter, dateFilter);
    console.log(`get Quarter Badges: username ${usernameFilter}, date:${dateFilter}`);
    const availableBadges = ctrl.getMissingBadgesFromResult(result);
    res.render("partials/badges-checkbox-list", { availableBadges });
  } catch (err) {
    console.error(`Failed to get the available badges for the quarter and username provided`, err);
    res.status(400).send(`Failed to get the available badges for the quarter and username provided ${err}`);
  }
});

// Handles the event of awarding a new badge
router.post("/awardbadge", async (req, res) => {
  const ctrl = new qtrLeaderboard();
  const { txtUsername, txtDateAwarded, txtDescription, badges } = req.body;
  const badgeList = Array.isArray(badges) ? badges : [badges]; // Ensure badges is an array
  try {
    ctrl.awardBadges(txtUsername, badgeList, txtDateAwarded, txtDescription)
    const result = await ctrl.getChampionsFridayLeaderboard('*'); // TODO find a way to refresh but with the date specified in the filers 
    const champs = ctrl.getChampionsLeaderboardFromResult(result);
    res.render("partials/leaderboard-cards", { champions: champs });
  } catch(err) {
    console.error("Error while attempting to award badges:", err);
    res.status(500).send("Error while attempting to award badges"); // TODO: Handle errors more robustly
    //TODO show error toast on client
    return;
  }
});

module.exports = router;
