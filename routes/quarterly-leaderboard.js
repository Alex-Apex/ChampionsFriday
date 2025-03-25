const express = require("express");
const router = express.Router();
const QuarterlyLeaderboardController = require('../controllers/quarterly-leaderboard-controller');

getQuarterlyFilterObject = (req) => {
  return {
    quarterId : req.query.txtQtrId || '*',
    practiceId : req.query.practiceFilter ? req.query.practiceFilter==='all'? '*': req.query.practiceFilter:'*',
    seniority: req.query.seniorityFilter || '*',
    badgeMaterial: req.query.badgeType || '*',
    badgeAxis: req.query.badgeAxis || '*'
  };
}

router.get('/', async (req, res) => {
  const ctrl = new QuarterlyLeaderboardController();
  try {
    const filter = getQuarterlyFilterObject(req);
    res.status(200).render("quarterly-leaderboard", await ctrl.getQuarterlyLeaderboardView(filter));
  } catch (err) {
    console.log('bad quarter id',err);
    res.status(400).send(`<h1>The Quarter you selected did not return any results. ${err}</h1>`);
  }
});
// TODO should we use /list or /addFilter for filtering? there is common code that could be refactored
router.get('/list', async (req, res) => {
  const ctrl = new QuarterlyLeaderboardController();
  try {
    const filter = getQuarterlyFilterObject(req);
    console.log("filter", filter);
    res.status(200).render("partials/quarter-leaderboard-list", await ctrl.getQuarterlyLeaderboardView(filter));
  } catch (err) {
    console.log('bad quarter id',err);
    res.status(400).send(`<h1>The Quarter you selected did not return any results. ${err}</h1>`);
  }
});

router.get('/addFilter', async (req, res) => {
  console.log('Inside /addFilter');
  const ctrl = new QuarterlyLeaderboardController();
  try {
    const filter = getQuarterlyFilterObject(req);
    console.log("filter", filter);
    res.status(200).render("partials/quarter-leaderboard-list", await ctrl.getQuarterlyLeaderboardView(filter));
  } catch (err) {
    console.log('bad quarter id',err);
    res.status(400).send(`<h1>The filters selected did not return any results. ${err}</h1>`);
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