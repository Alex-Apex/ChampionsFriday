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


// Handles the event of awarding a new badge
router.post("/awardbadge", (req, res) => {
  const { txtUsername, txtDateAwarded, txtDescription, badges } = req.body;
  const badgeList = Array.isArray(badges) ? badges : [badges]; // Ensure badges is an array

  const newAward = {
    username:txtUsername,
    dateAwarded:txtDateAwarded,
    description:txtDescription,
    badges: badgeList.map(badge => ({ name: badge })),
  };

  // Here you would insert newAward into your database
  // For demonstration, we'll just log it and send it back in the response
  console.log("New award:", newAward);

  // Dummy data for badges to render (you should replace this with a database query)
  const allBadges = [...badgeList.map(badge => ({ name: badge, recipient: newAward.username })),];

  res.render("partials/badges", { badges: newAward });
});

module.exports = router;
