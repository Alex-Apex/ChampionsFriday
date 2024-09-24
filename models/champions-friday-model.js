const { poolPromise, sql } = require('../database/db'); // TODO refactor this out to the model

class ChampionsFridayModel {
  constructor() {
    this.MATERIAL_CATALOG = [
      'N/A', // 0 => you have not obtained any badges yet
      'Wood',
      'Bronze',
      'Silver',
      'Gold',
      'Platinum',
      'Diamond'
    ];

    this.BADGES_CATALOG = [
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
  };
    
  /**
   * Returns an array with all the badges in the catalog
   * @returns 
  */
 getAllBadges() {
   const badges = this.BADGES_CATALOG.reduce((acc, axis) => {    
     return acc.concat(axis.Badges);
    },[]);
    return badges;
  };
  
  /**
   * 
   * @param {*} badgeCount 
   * @returns 
   */
  getBadgeMaterial(badgeCount) {
    if(badgeCount>=0  && badgeCount <= 6){
      return this.MATERIAL_CATALOG[badgeCount];
    } else if(badgeCount>6) {
      return "Unobtanium";
    } else {
      return this.MATERIAL_CATALOG[0];
    }
  }

  /**
   * Calculates the WHERE clause to be used in a query from the filter configuration
   * @param {} filter 
   * @returns 
   */
  _getWhereClauseFromFilter(filter){
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
    return whereClause;
  };
  /**
   * Builds the filter which is to be used in the query
   * @param {*} filter 
   * @returns 
   */
  async getChampionsFridayLeaderboard(filter) { //TODO rename this to quarterly leaderboard...
    try {
      const whereClause = this._getWhereClauseFromFilter(filter);      
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
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      return this._getChampionsLeaderboardFromResult(result.recordset); // Return the results
    } catch (err) {
      console.error('Error fetching Champions Friday leaderboard:', err);
      throw err; // Rethrow the error for handling elsewhere
    }
  };

  /**
   * Gets the leaderboard from results object
   * TODO: this is hardly couppled with the getChampions Leaderboard method. Need to uncoupple it. 
   * @param {*} result 
   * @returns 
   */
  _getChampionsLeaderboardFromResult(result) {
    const flatBadgesCatalog = this.getAllBadges();
    const champions = result
      .map((row) => {
        //get all badges and materials per row
        const employeeBadges = flatBadgesCatalog.map((badge) => {
          return {
            name: badge,
            material: this.getBadgeMaterial(parseInt(row[badge])),
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
  };


   /**
   * Returns all the missing badges by determining which ones have been earned already
   * @param {*} result 
   */
   getMissingBadgesFromResult(result) {
    let missingBadges = [];
    if (result.length === 0) {
      missingBadges = this.getAllBadges().map((badge) => {
        return { name: badge, material: 'N/A' };
      });
    } else {
      const user = this.getChampionsLeaderboardFromResult(result)[0]; //assuming it is always the first one
      missingBadges = user.badges.filter((badge) => {
        return badge.material === 'N/A';
      });
    }
    return missingBadges;
  };


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
  };

  /**
    * 
    * @param {*} username 
    * @param {*} badgeList 
    * @param {*} dateAwarded 
    * @param {*} meritDescription 
    * @returns 
    */
  async awardBadges(username, badgeList, dateAwarded, meritDescription){
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
        .input('Username', sql.VarChar(sql.MAX), username)
        .input('PerformanceEventTypeIds', sql.NVarChar, performanceEventTypeIds)
        .input('Notes', sql.Text, meritDescription)
        .input('DateOccurred', sql.Date, dateAwarded);
  
      await request.execute('InsertMultipleEmployeePerformanceEvents');
      console.log("New Badges Awarded: ", badgeList);
      return true;
    } catch (err) {
      throw new Error('Failed to insert badges', err);
    }
  };

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
  };
};

module.exports =  ChampionsFridayModel;
