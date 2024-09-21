const express = require("express");
const router = express.Router();

/**
 * Root route for roster management
 */
router.get("/", async (req, res) => { 
  res.render("anonymous-validator", {});
});

module.exports = router;