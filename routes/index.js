const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.render("index");
});

// Add more routes here for capturing badges, etc.

module.exports = router;
