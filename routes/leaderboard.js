const express = require("express");
const router = express.Router();

const champions = [
  {
    name: "Juan Perez",
    seniority: "Senior Developer",
    practice: "Frontend Development",
    totalBadges: 10,
    quarterBadges: 5,
    badges: [
      { name: "Champion", material: "Bronze", axis: "Professional Excellence" },
      {
        name: "Integrity",
        material: "Silver",
        axis: "Professional Excellence",
      },
      { name: "Mentor", material: "Gold", axis: "Professional Excellence" },
      { name: "Trailblazer", material: "Wood", axis: "Collaborative Synergy" },
      {
        name: "Collaborator",
        material: "Platinum",
        axis: "Collaborative Synergy",
      },
    ],
  },
  {
    name: "Maria Rodriguez",
    seniority: "Junior Developer",
    practice: "Backend Development",
    totalBadges: 8,
    quarterBadges: 3,
    badges: [
      { name: "Champion", material: "Wood", axis: "Professional Excellence" },
      {
        name: "Integrity",
        material: "Bronze",
        axis: "Professional Excellence",
      },
      { name: "Mentor", material: "Silver", axis: "Professional Excellence" },
      { name: "Trailblazer", material: "Wood", axis: "Collaborative Synergy" },
      {
        name: "Collaborator",
        material: "Bronze",
        axis: "Collaborative Synergy",
      },
    ],
  },
  {
    name: "Carlos Sanchez",
    seniority: "Mid-Level Developer",
    practice: "Mobile Development",
    totalBadges: 12,
    quarterBadges: 6,
    badges: [
      { name: "Champion", material: "Gold", axis: "Professional Excellence" },
      { name: "Integrity", material: "Gold", axis: "Professional Excellence" },
      { name: "Mentor", material: "Platinum", axis: "Professional Excellence" },
      {
        name: "Trailblazer",
        material: "Silver",
        axis: "Collaborative Synergy",
      },
      { name: "Collaborator", material: "Gold", axis: "Collaborative Synergy" },
    ],
  },
  {
    name: "Laura Garcia",
    seniority: "Lead Developer",
    practice: "DevOps",
    totalBadges: 15,
    quarterBadges: 7,
    badges: [
      {
        name: "Champion",
        material: "Platinum",
        axis: "Professional Excellence",
      },
      {
        name: "Integrity",
        material: "Diamond",
        axis: "Professional Excellence",
      },
      { name: "Mentor", material: "Diamond", axis: "Professional Excellence" },
      { name: "Trailblazer", material: "Gold", axis: "Collaborative Synergy" },
      {
        name: "Collaborator",
        material: "Platinum",
        axis: "Collaborative Synergy",
      },
    ],
  },
  {
    name: "David Martinez",
    seniority: "Principal Developer",
    practice: "Data Science",
    totalBadges: 9,
    quarterBadges: 4,
    badges: [
      { name: "Champion", material: "Bronze", axis: "Professional Excellence" },
      {
        name: "Integrity",
        material: "Silver",
        axis: "Professional Excellence",
      },
      { name: "Mentor", material: "Gold", axis: "Professional Excellence" },
      {
        name: "Trailblazer",
        material: "Silver",
        axis: "Collaborative Synergy",
      },
      { name: "Collaborator", material: "Gold", axis: "Collaborative Synergy" },
    ],
  },
  {
    name: "Sara Lopez",
    seniority: "Intern",
    practice: "Quality Assurance",
    totalBadges: 5,
    quarterBadges: 2,
    badges: [
      { name: "Champion", material: "Wood", axis: "Professional Excellence" },
      { name: "Integrity", material: "Wood", axis: "Professional Excellence" },
      { name: "Mentor", material: "Bronze", axis: "Professional Excellence" },
      { name: "Trailblazer", material: "Wood", axis: "Collaborative Synergy" },
      { name: "Collaborator", material: "Wood", axis: "Collaborative Synergy" },
    ],
  },
];

router.get("/", (req, res) => {
  res.render("partials/leaderboard-rows", { champions });
});

module.exports = router;
