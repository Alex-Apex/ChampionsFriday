const {poolPromise, sql} = require('../database/db');

class RosterManager {
  constructor(team) {    
    this.roster = [];
  }
  /**
 * Inserts a new employee into the database.
 * @param {object} employee - The employee object containing
 * details to be inserted.
 * @return {Promise<object>} - The inserted employee object.
 */
async insertEmployee(employee) {
  try {
    const pool = await appConnectionPoolPromise.connect();
    const request = pool.request();

    request
        .input('EmployeeName', sql.NVarChar, employee.employeeName)
        .input('EmployeeTitle', sql.NVarChar, employee.employeeTitle)
        .input('ApexUsername', sql.NVarChar, employee.apexUsername)
        .input('SupervisorName', sql.NVarChar, employee.supervisorName)
        .input('PracticeName', sql.NVarChar, employee.practiceName)
        .input('PoolId', sql.NVarChar, employee.poolId);

    const result = await request.execute('InsertEmployee');
    return result.recordset[0];
  } catch (error) {
    console.error('Error inserting employee:', error);
    throw error;
  }
};

  /**
   * 
   * @returns 
   */
  async getRoster() {
    const query = `
   WITH EmployeeHierarchy AS
  (
      SELECT
          id,
          name,
          username,
          current_title,
          supervisor_id,
          practice_id
      FROM
          EMPLOYEES
      WHERE
          id = 2  -- the Id of the director you're starting from
  
      UNION ALL
  
      SELECT
          E.id,
          E.name,
          E.username,
          E.current_title,
          E.supervisor_id,
          E.practice_id
      FROM
          EMPLOYEES E
      INNER JOIN EmployeeHierarchy EH ON E.supervisor_id = EH.id
  )
  SELECT  EHE.id,
          EHE.name,
          EHE.username,
          EHE.current_title,
          EHE.supervisor_id,
          ESup.name AS supervisor_name,
          EHE.practice_id, P.name AS practice_name 
  FROM EmployeeHierarchy EHE INNER JOIN Practices P
    ON EHE.practice_id = P.id
    INNER JOIN Employees ESup
    ON EHE.supervisor_id = ESup.id;
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