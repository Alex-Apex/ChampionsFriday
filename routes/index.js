const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.render("index");
});

// Example route for badges
router.get("/badges", (req, res) => {
  const badges = [
    { name: "Team Player", recipient: "John Doe" },
    { name: "Innovator", recipient: "Jane Smith" },
  ];
  res.render("partials/badges", { badges });
});

module.exports = router;
