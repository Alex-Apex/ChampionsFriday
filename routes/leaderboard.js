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
const BADGES_CATALOG = [
  {
    Axis: 'Professional Excellence',
    Badges: ['Champion', 'Integrity', 'Mentor', 'Pro']
  },
  {
    Axis:'Collaborative Synergy', 
    Badges: ['Trailblazer', 'Collaborator','Reliable', 'Visionary']
  },
  {
    Axis: 'Technical Mastery',
    Badges:['Adaptive','Expert', 'Deep Diver', 'Versatile']
  }
];

// Function to get the Champions' Friday leaderboard
async function getChampionsFridayLeaderboard() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
          SELECT 
              E.current_title AS [Current Title],
              CFL.[id],
              CFL.[name],
              P.[name] AS [Practice Name],
              CFL.[Total Badges],
              CFL.[Earn Champion Badge] AS [Champion],
              CFL.[Earn Integrity Badge] AS [Integrity],
              CFL.[Earn Mentor Badge] AS [Mentor],
              CFL.[Earn Pro Badge] AS [Pro],
              CFL.[Earn Trailblazer Badge] AS [Trailblazer],
              CFL.[Earn Collaborator Badge] AS [Collaborator],
              CFL.[Earn Reliable Badge] AS [Reliable],
              CFL.[Earn Visionary Badge] AS [Visionary],
              CFL.[Earn Adaptive Badge] AS [Adaptive],
              CFL.[Earn Expert Badge] AS [Expert],
              CFL.[Earn Deep Diver Badge] AS [Deep Diver],
              CFL.[Earn Versatile Badge] AS [Versatile],
              CFL.[Receive a CAN] AS [CANs],
              CFL.[Receive an Administrative Act] AS [A.Acts]
          FROM 
            [dbo].[ChampionsFridayLeaderboard] CFL 
              INNER JOIN [dbo].[Employees] E On CFL.id = E.id
              INNER JOIN [dbo].[Practices] P ON E.practice_id = P.id
          ORDER BY CFL.[Total Badges] DESC
      `);

    return result.recordset; // Return the results
  } catch (err) {
    console.error('Error fetching Champions Friday leaderboard:', err);
    throw err; // Rethrow the error for handling elsewhere
  }
}

function getAllBadges() {
  const badges = BADGES_CATALOG.reduce((acc, axis) => {    
    return acc.concat(axis.Badges);
  },[]);
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
      const employeeBadges = flatBadgesCatalog.map((badge) => {
        return { 
          name: badge,
          material: getBadgeMaterial(parseInt(row[badge]))
        }
      });
      return {
        name: row.name,
        seniority: row['Current Title'],
        practice: row['Practice Name'],
        totalBadges: row["Total Badges"],
        badges: employeeBadges
      }
    });
  //console.log(champions);
  res.render("partials/leaderboard-rows", { champions });
});

module.exports = router;
