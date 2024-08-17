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

/**
 * Validaes the filter for quarters has this following form:
 * Q#-yyyy
 * where # is a number from 1-4 and yyyy is a 4 digit year
 * or * for all quarters
 * @param {*} filter
 * @returns
 */
function isValidLeaderboardQuarterFilter(filter){
    //validate filter against regex that either has * or has letter Q#-yyyy
    if (!filter || (filter !== '*' && !/^Q\d-\d{4}$/.test(filter))) {
      return false;
    }
    return true;    
  };

  // Function to get the Champions' Friday leaderboard
  async function getChampionsFridayLeaderboard(filter) {
    let whereClause = '';
    if(isValidLeaderboardQuarterFilter(filter)){
      if (filter === '*') {
        whereClause = '';
      } else {
        whereClause = `WHERE CFL.[Quarter] = '${filter}'`;
      }
    } else {
      throw new Error (`User defined invalid quarter filter: ${filter}`); 
    }  

  try {
    const pool = await poolPromise;
    const query = `
          SELECT 
              CFL.[id],
              CFL.[name],
              P.[name] AS [Practice Name]
              ,E.current_title AS [Current Title]
              ,CFL.[Grand Total Badges]
              ,CFL.[Quarter Badges]
              ,CFL.[Quarter],
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
              [dbo].[ChampionsFridayLeaderboardByQuarter]CFL 
              INNER JOIN [dbo].[Employees] E On CFL.id = E.id
              INNER JOIN [dbo].[Practices] P ON E.practice_id = P.id
          ${whereClause}
          ORDER BY CFL.[Grand Total Badges] DESC
      `;
      console.log(query);
    const result = await pool.request().query(query);
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
  const filter = req.query.txtQtrId || '*';
  const championsRows = await getChampionsFridayLeaderboard(filter);  
  const champions = getChampionsLeaderboardFromResult(championsRows);
  res.render("partials/leaderboard-cards", { champions });
});

/**
 * 
 * @param {*} username 
 * @param {*} quarterId 
 */
async function getUsernameQuarterBadges(username, quarterId) {
  const whereClause = ` WHERE CFL.[Quarter] = dbo.fn_GetQuarter(${quarterId}) AND E.[username] LIKE '${username}'`;
  try {
    const pool = await poolPromise;
    const query = `
          SELECT 
              CFL.[id],
              CFL.[name],
              P.[name] AS [Practice Name]
              ,E.current_title AS [Current Title]
              ,CFL.[Grand Total Badges]
              ,CFL.[Quarter Badges]
              ,CFL.[Quarter],
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
              [dbo].[ChampionsFridayLeaderboardByQuarter]CFL 
              INNER JOIN [dbo].[Employees] E On CFL.id = E.id
              INNER JOIN [dbo].[Practices] P ON E.practice_id = P.id
          ${whereClause}
          ORDER BY CFL.[Grand Total Badges] DESC
      `;
      console.log(query);
    const result = await pool.request().query(query);
    return result.recordset; // Return the results
  } catch (err) {
    console.error(`Failed fetching ${username}'s badges for quarter:${quarterId}`, err);
    throw err; // Rethrow the error for handling elsewhere
  }
};

/**
 * Returns all the missing badges by determining which ones have been earned already
 * @param {*} result 
 */
function getMissingBadgesFromResult(result) {
  // TODO: careful with the case where this result ends up empty
  const user = getChampionsLeaderboardFromResult(result)[0]; //assuming it is always the first one
  const missingBadges =  user.badges.filter((badge) => {
    return badge.material === 'N/A';  
  });
  return missingBadges;
};

/**
 * 
 */
router.get("/quarter-badges", async(req, res) => {
  const usernameFilter = req.query.txtUsername?`${req.query.txtUsername}` : `'%%'`;
  const dateFilter = req.query.txtDateAwarded
  ? `'${req.query.txtDateAwarded}'`
  : `'${new Date().toISOString().split('T')[0]}'`;
  try {
    const result = await getUsernameQuarterBadges(usernameFilter, dateFilter);
    console.log(`get Quarter Badges: username ${usernameFilter}, date:${dateFilter}`);
    const availableBadges = getMissingBadgesFromResult(result);
    res.render("partials/badges-checkbox-list", { availableBadges });
  } catch (err) {
    console.error(`Failed to get the available badges for the quarter and username provided`,err);
    throw err
  }
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
    res.render("partials/leaderboard-cards", { champions: champs});

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
        id: row.id,
        name: row.name,
        seniority: row['Current Title'],
        practice: row['Practice Name'],
        grandTotalBadges: row['Grand Total Badges'],
        quarterBadges: row['Quarter Badges'],
        quarter: row['Quarter'],
        badges: employeeBadges
      }
    });
    return champions;
}

module.exports = router;
