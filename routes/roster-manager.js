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

/**
 * 
 */
router.post("/create-employee", async (req, res) => {
  const ctrl = new rosterManagerController();  

  // TODO exception handling
  res.send(await ctrl.createEmployee(req.body));
});

/**
 * 
 */
router.get('/edit-employee', async (req, res) => {
  const ctrl = new rosterManagerController();
  console.log('About to edit employee', req.query);
  try {
    res.status(200).render('partials/dialog-edit-employee', await ctrl.getEditEmployeeScreen(req.query.id));
  } catch(err){
    res.status(500).send(err);
    //res.status(402).render('error', {message: err.message});
  }
});

module.exports = router;