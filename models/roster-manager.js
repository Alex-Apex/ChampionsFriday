const {poolPromise, sql} = require('../database/db');

class RosterManager {
  constructor(team) {    
    this.roster = [];
  }

  /**
   * 
   * @returns 
   */
  async getRoster() {
    const query = `
    SELECT * 
    FROM Employees
    `;
    //----
    try {
      const pool = await poolPromise;
      console.log(query);
      const result = await pool.request().query(query);
      return result.recordset; // Return the results
    } catch (err) {
      console.error('RosterManager: Error fetching Organizational Structure', err);
      throw err; // Rethrow the error for handling elsewhere
    }
  }
};

module.exports = RosterManager;