// This is the badges-hall router.js file for badges
const express = require("express");
const router = express.Router();
const BadgesHallController = require('../controllers/badges-hall-controller');


router.get("/", async (req, res) => {
  const ctrl = new BadgesHallController();
  try {
    res.status(200).render("badges-hall", await ctrl.getBadgesHallView());
  } catch (err) {
    console.log('badges hall: error', err);
    res.status(400).send('<h1>The Badges Hall could not be loaded</h1>');
  }
});

module.exports = router;