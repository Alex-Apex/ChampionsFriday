const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require('../database/db');

// Home route
router.get("/", (req, res) => {
  res.render("index");
});

/**
 * Receives a Performance event for a particular employee and 
 * inserts it in the db
 * @param {*} EmployeePerformanceEvent 
 */
async function insertEmployeePerformanceEvent(event) { // TODO factor this function out of this and into an employee services file
  try {
    const pool = await appConnectionPoolPromise.connect();
    const request = pool.request();
    request
      .input('EmployeeId', sql.Int, event.employeeId)
      .input('PerformanceEventTypeId', sql.Int, event.performanceEventTypeId)
      .input('Notes', sql.VarChar(sql.MAX), event.notes);
    if (event.dateOccurred !== null && event.dateOccurred !== '') {
      console.log('Event Date Occurred:', event.dateOccurred);
      request.input('DateOccurred', sql.Date, event.dateOccurred);
    }
    const result = await request.execute('InsertEmployeePerformanceEvent');
    return result.recordset[0];
  } catch (exception) {
    console.error('Error while trying to insert performance evente', exception);
    throw error;
  }
};

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

    res.render("partials/leaderboard-rows", { champions: result});

  } catch (err) {
    console.error("Error while attepmting to award badges:", err);
    res.status(500).send("Error while attempting to award badges"); // TODO: Handle errors more robustly
    return;
  }
});

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
      `);

      return result.recordset; // Return the results
  } catch (err) {
      console.error('Error fetching Champions Friday leaderboard:', err);
      throw err; // Rethrow the error for handling elsewhere
  }
}

module.exports = router;
