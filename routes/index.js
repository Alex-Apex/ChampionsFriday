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
