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
  const champions = getChampionsLeaderboardFromResult(championsRows);
  res.render("partials/leaderboard-rows", { champions });
});

// Handles the event of awarding a new badge
router.post("/awardbadge", async (req, res) => {
  const { txtUsername, txtDateAwarded, txtDescription, badges } = req.body;
  const badgeList = Array.isArray(badges) ? badges : [badges]; // Ensure badges is an array
  const performanceEventTypeIds = badgeList.map(badge => {
    // You need to map the badge name to its corresponding PerformanceEventTypeId
    switch (badge) {
      case "Champion": return 1;
      case "Integrity": return 2;
      case "Mentor": return 3;
      case "Pro": return 4;
      case "Trailblazer": return 5;
      case "Collaborator": return 6;
      case "Reliable": return 7;
      case "Visionary": return 8;
      case "Adaptive": return 9;
      case "Expert": return 10;
      case "Deep Diver": return 11;
      case "Versatile": return 12;
      default: return null;
    }
  }).filter(id => id !== null).join(',');

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request
      .input('Username', sql.VarChar(sql.MAX), txtUsername)
      .input('PerformanceEventTypeIds', sql.NVarChar, performanceEventTypeIds)
      .input('Notes', sql.Text, txtDescription)
      .input('DateOccurred', sql.Date, txtDateAwarded);

    await request.execute('InsertMultipleEmployeePerformanceEvents');
    console.log("New Badges Awarded: ",badgeList);

    const result = await getChampionsFridayLeaderboard();
    const champs = getChampionsLeaderboardFromResult(result);
    res.render("partials/leaderboard-rows", { champions: champs});

  } catch (err) {
    console.error("Error while attepmting to award badges:", err);
    res.status(500).send("Error while attempting to award badges"); // TODO: Handle errors more robustly
    return;
  }
});

function getChampionsLeaderboardFromResult(result) {
  const flatBadgesCatalog = getAllBadges();
  const champions = result
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
    return champions;
}

module.exports = router;
