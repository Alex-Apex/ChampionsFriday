const express = require("express");
const router = express.Router();
const rosterManagerController = require('../controllers/roster-manager-controller');

/**
 * Root route for roster management
 */
router.get("/", async (req, res) => {
  const ctrl = new rosterManagerController();
  res.render("roster-manager", await ctrl.getViewObject());
});

module.exports = router;