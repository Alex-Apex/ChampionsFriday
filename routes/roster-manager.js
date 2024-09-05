const express = require("express");
const router = express.Router();
const rosterManagerController = require('../controllers/roster-manager-controller');

/**
 * Root route for roster management
 */
router.get("/", async (req, res) => {
  const ctrl = new rosterManagerController();
  // TODO implement exception handling
  res.render("roster-manager", await ctrl.getViewObject());
});

/**
 * 
 */
router.get("/name-from-username",async (req, res) => {
  const ctrl = new rosterManagerController();
  // TODO exception handling  
  res.send(await ctrl.getNameFromUsername(req.query.txtSupervisorUsername));
});

module.exports = router;