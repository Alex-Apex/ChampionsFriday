
require('dotenv').config();
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const indexRouter = require("./routes/index");
const levelLeaderboardRouter = require("./routes/level-leaderboard");
const quarterlyLeaderboardRouter = require("./routes/quarterly-leaderboard");
const rosterManagerRouter = require("./routes/roster-manager");
const badgesHallRouter = require("./routes/badges-hall");
const anonymousValidator = require("./routes/anonymous-validator");

const app = express();
const PORT = process.env.PORT || 3000;

// Set Handlebars as the templating engine
app.engine("handlebars", engine({ 
  defaultLayout: "main", 
  helpers:{ 
    eq: function(a, b) {
      return a === b;
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/badges-hall", badgesHallRouter);
app.use("/level-leaderboard", levelLeaderboardRouter);
app.use("/quarterly-leaderboard", quarterlyLeaderboardRouter);
app.use("/roster-manager", rosterManagerRouter);
app.use("/anonymous-validator", anonymousValidator);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
