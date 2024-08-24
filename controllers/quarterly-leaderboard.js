/**
 * Quarterly leaderboard controller
 */
const { poolPromise, sql } = require('../database/db');
const {
  BADGES_CATALOG,
  MATERIAL_CATALOG,
  getAllBadges,
  getBadgeMaterial
} = require('../models/champions-friday');

class QuarterlyLeaderboard {
  constructor(){

  }
  /**
   * Validaes the filter for quarters has this following form:
   * Q#-yyyy
   * where # is a number from 1-4 and yyyy is a 4 digit year
   * or * for all quarters
   * @param {*} filter
   * @returns
   */
  isValidLeaderboardQuarterFilter(filter) {
    //validate filter against regex that either has * or has letter Q#-yyyy
    if (!filter || (filter !== '*' && !/^Q\d-\d{4}$/.test(filter))) {
      return false;
    }
    return true;
  }

  /**
   * 
   * @param {*} filter 
   * @returns 
   */
  async getChampionsFridayLeaderboard(filter) {
    let whereClause = '';
    if (this.isValidLeaderboardQuarterFilter(filter)) {
      if (filter === '*') {
        whereClause = '';
      } else {
        whereClause = `WHERE CFL.[Quarter] = '${filter}'`;
      }
    } else {
      throw new Error(`User defined invalid quarter filter: ${filter}`);
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


  /**
   * 
   * @param {*} username 
   * @param {*} quarterId 
   */
  async getUsernameQuarterBadges(username, quarterId) {
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
  }

  /**
   * Returns all the missing badges by determining which ones have been earned already
   * @param {*} result 
   */
  getMissingBadgesFromResult(result) {
    let missingBadges = [];
    if (result.length === 0) {
      missingBadges = getAllBadges().map((badge) => {
        return { name: badge, material: 'N/A' };
      });
    } else {
      const user = getChampionsLeaderboardFromResult(result)[0]; //assuming it is always the first one
      missingBadges = user.badges.filter((badge) => {
        return badge.material === 'N/A';
      });
    }
    return missingBadges;
  }

  /**
   * 
   * @param {*} result 
   * @returns 
   */
  getChampionsLeaderboardFromResult(result) {
    const flatBadgesCatalog = getAllBadges();
    const champions = result
      .map((row) => {
        //get all badges and materials per row
        const employeeBadges = flatBadgesCatalog.map((badge) => {
          return {
            name: badge,
            material: getBadgeMaterial(parseInt(row[badge])),
            count: parseInt(row[badge])
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
};

module.exports = QuarterlyLeaderboard;