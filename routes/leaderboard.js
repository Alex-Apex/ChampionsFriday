const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require('../database/db');
const MATERIAL_CATALOG = [
  'N/A', // 0 => you have not obtained any badges yet
  'Wood',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond'
];
const BADGES_CATALOG = {
  'Professional Excellence': ['Champion', 'Integrity', 'Mentor', 'Pro'],
  'Collaborative Synergy': ['Trailblazer', 'Collaborator','Reliable', 'Visionary'],
  'Technical Mastery':['Adaptive','Expert', 'Deep Diver', 'Versatile']
};

// Function to get the Champions' Friday leaderboard
async function getChampionsFridayLeaderboard() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
          SELECT 
              [id],
              [name],
              [Total Badges],
              [Earn Champion Badge] AS [Champion],
              [Earn Integrity Badge] AS [Integrity],
              [Earn Mentor Badge] AS [Mentor],
              [Earn Pro Badge] AS [Pro],
              [Earn Trailblazer Badge] AS [Trailblazer],
              [Earn Collaborator Badge] AS [Collaborator],
              [Earn Reliable Badge] AS [Reliable],
              [Earn Visionary Badge] AS [Visionary],
              [Earn Adaptive Badge] AS [Adaptive],
              [Earn Expert Badge] AS [Expert],
              [Earn Deep Diver Badge] AS [Deep Diver],
              [Earn Versatile Badge] AS [Versatile],
              [Receive a CAN] AS [CANs],
              [Receive an Administrative Act] AS [A.Acts]
          FROM [dbo].[ChampionsFridayLeaderboard]
          ORDER BY [Total Badges] DESC
      `);

    return result.recordset; // Return the results
  } catch (err) {
    console.error('Error fetching Champions Friday leaderboard:', err);
    throw err; // Rethrow the error for handling elsewhere
  }
}

function getAllBadges() {
  const badges = Object.values(BADGES_CATALOG)
        .reduce((acc, axis, idx, arr) => {
          axis.map((v) => {
            acc.push(v)});
            return acc;
          });
  return badges;
}

/**
 * 
 * @param {*} badgeCount 
 * @returns 
 */
function getBadgeMaterial(badgeCount) {
  if(badgeCount>=0  && badgeCount <= 6){
    return MATERIAL_CATALOG[badgeCount];
  } else if(badgeCount>6) {
    return "Unobtanium";
  } else {
    return MATERIAL_CATALOG[0];
  }
}

router.get("/", async (req, res) => {
  const championsRows = await getChampionsFridayLeaderboard();
  const flatBadgesCatalog = getAllBadges();
  const champions = championsRows
    .map((row) => {
      //get all badges and materials per row
      const employeeBadges = flatBadgesCatalog.map(badge => {
        return { 
          name: badge, 
          material: getBadgeMaterial(parseInt(row[badge]))
        }
      });
      return {
        name: row.name,
        totalBadges: row["Total Badges"],
        badges: employeeBadges
      }
    });
  console.log(champions);
  res.render("partials/leaderboard-rows", { champions });
});

module.exports = router;
