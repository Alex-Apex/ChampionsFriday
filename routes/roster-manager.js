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
router.get("/employee-from-username",async (req, res) => {
  const ctrl = new rosterManagerController();
  console.log('Payload: ',req.query);
  // TODO exception handling  
  res.send(await ctrl.getEmployeeFromUsername(req.query.txtSupervisorUsername, req.query.isEdit));
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
 * Brings up the edit employee screen
 * TODO: consider better mnemonic here. 
 */
router.get('/edit-employee', async (req, res) => {
  const ctrl = new rosterManagerController();  
  try {
    res.status(200).render('partials/dialog-edit-employee', await ctrl.getEditEmployeeScreen(req.query.id));
  } catch(err){
    res.status(500).send(err);
    //res.status(402).render('error', {message: err.message});
  }
});

/**
 * 
 */
router.post('/update-employee', async (req, res) => {
  const ctrl = new rosterManagerController();
  console.log('About to update employee', req.body);
  try{
    await ctrl.updateEmployee(req.body);
    res.status(200).render("partials/roster-list", await ctrl.getViewObject());
  } catch(err) {
    res.status(500).send(err);
    //res.status(???).render('error', {message: err.message});
  }
});

module.exports = router;